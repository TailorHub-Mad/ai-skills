#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

const [,, command, skillUrl] = process.argv;

if (command !== 'add' || !skillUrl) {
  console.error('Usage: npx @tailorhub/skills add <github-skill-url>');
  console.error('Example: npx @tailorhub/skills add https://github.com/TailorHub-Mad/ai-skills/tailor-code-review');
  process.exit(1);
}

function parseSkillUrl(url) {
  const parsed = new URL(url);
  const segments = parsed.pathname.split('/').filter(Boolean);
  // segments: ['owner', 'repo', 'skill']
  if (segments.length < 3) {
    throw new Error(`Invalid skill URL. Expected format: https://github.com/<owner>/<repo>/<skill>`);
  }
  const [owner, repo, ...rest] = segments;
  const skill = rest.join('/');
  return { owner, repo, skill };
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': '@tailorhub/skills-cli' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(httpsGet(res.headers.location));
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        res.resume();
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function downloadFile(downloadUrl, destPath) {
  const data = await httpsGet(downloadUrl);
  fs.writeFileSync(destPath, data);
}

async function installSkill(owner, repo, skill) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/skills/${skill}`;

  console.log(`Fetching skill "${skill}" from ${owner}/${repo}...`);

  let files;
  try {
    const body = await httpsGet(apiUrl);
    files = JSON.parse(body.toString());
  } catch (err) {
    throw new Error(`Could not fetch skill from GitHub API: ${err.message}`);
  }

  if (!Array.isArray(files)) {
    throw new Error(`Unexpected response from GitHub API — is the skill path correct?`);
  }

  const installDir = path.join(os.homedir(), '.claude', 'skills', skill);
  fs.mkdirSync(installDir, { recursive: true });

  for (const file of files) {
    if (file.type !== 'file') continue;
    const destPath = path.join(installDir, file.name);
    console.log(`  Downloading ${file.name}...`);
    await downloadFile(file.download_url, destPath);
  }

  console.log(`\nSkill "${skill}" installed to ~/.claude/skills/${skill}/`);
  console.log(`Restart Claude Code to use it.`);
}

const { owner, repo, skill } = parseSkillUrl(skillUrl);

installSkill(owner, repo, skill).catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
