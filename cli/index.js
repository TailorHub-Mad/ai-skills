#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

const [,, command, arg] = process.argv;

if (!command || !['add', 'update'].includes(command)) {
  console.error('Usage:');
  console.error('  npx @tailorhub/skills add <github-skill-url>');
  console.error('  npx @tailorhub/skills update [skill-name]');
  console.error('');
  console.error('Examples:');
  console.error('  npx @tailorhub/skills add https://github.com/TailorHub-Mad/ai-skills/tailor-code-review');
  console.error('  npx @tailorhub/skills update');
  console.error('  npx @tailorhub/skills update tailor-code-review');
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

async function installSkill(owner, repo, skill, sourceUrl) {
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

  // Save source metadata for future updates
  const sourceMeta = { url: sourceUrl, owner, repo, skill };
  fs.writeFileSync(
    path.join(installDir, '.source.json'),
    JSON.stringify(sourceMeta, null, 2)
  );

  return installDir;
}

async function updateSkill(skillName) {
  const skillDir = path.join(os.homedir(), '.claude', 'skills', skillName);
  const sourcePath = path.join(skillDir, '.source.json');

  if (!fs.existsSync(sourcePath)) {
    throw new Error(
      `No source info found for "${skillName}". ` +
      `Re-install it with "npx @tailorhub/skills add <url>" to enable updates.`
    );
  }

  let source;
  try {
    source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  } catch {
    throw new Error(`Could not read source info for "${skillName}": malformed .source.json`);
  }

  const installDir = await installSkill(source.owner, source.repo, source.skill, source.url);
  console.log(`\nSkill "${skillName}" updated at ${installDir}/`);
  console.log(`Restart Claude Code to apply changes.`);
}

async function updateAllSkills() {
  const skillsRoot = path.join(os.homedir(), '.claude', 'skills');

  if (!fs.existsSync(skillsRoot)) {
    console.log('No skills directory found. Nothing to update.');
    return;
  }

  const entries = fs.readdirSync(skillsRoot, { withFileTypes: true });
  const skillDirs = entries
    .filter(e => e.isDirectory())
    .filter(e => fs.existsSync(path.join(skillsRoot, e.name, '.source.json')));

  if (skillDirs.length === 0) {
    console.log('No updatable skills found.');
    console.log('Re-install skills with "npx @tailorhub/skills add <url>" to enable updates.');
    return;
  }

  console.log(`Updating ${skillDirs.length} skill(s)...\n`);

  const results = { ok: [], failed: [] };

  for (const dir of skillDirs) {
    try {
      await updateSkill(dir.name);
      results.ok.push(dir.name);
    } catch (err) {
      console.error(`  Failed to update "${dir.name}": ${err.message}`);
      results.failed.push(dir.name);
    }
    console.log('');
  }

  console.log(`Done. ${results.ok.length} updated, ${results.failed.length} failed.`);
  if (results.ok.length > 0) {
    console.log(`Restart Claude Code to apply changes.`);
  }
}

// --- Entry points ---

if (command === 'add') {
  if (!arg) {
    console.error('Usage: npx @tailorhub/skills add <github-skill-url>');
    process.exit(1);
  }

  let parsed;
  try {
    parsed = parseSkillUrl(arg);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { owner, repo, skill } = parsed;

  installSkill(owner, repo, skill, arg)
    .then((installDir) => {
      console.log(`\nSkill "${skill}" installed to ${installDir}/`);
      console.log(`Restart Claude Code to use it.`);
    })
    .catch((err) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
}

if (command === 'update') {
  if (arg) {
    updateSkill(arg).catch((err) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
  } else {
    updateAllSkills().catch((err) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
  }
}
