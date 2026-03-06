#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';

const VALID_TARGETS = new Set(['claude', 'codex', 'opencode', 'all']);
const TARGET_CONFIG = {
  claude: {
    label: 'Claude Code',
    skillsRoot: path.join(os.homedir(), '.claude', 'skills'),
  },
  codex: {
    label: 'Codex',
    skillsRoot: path.join(os.homedir(), '.codex', 'skills'),
  },
  opencode: {
    label: 'OpenCode',
    skillsRoot: path.join(os.homedir(), '.config', 'opencode', 'skills'),
  },
};

function printUsage() {
  console.error('Usage:');
  console.error('  npx @tailorhub/skills                                                        (interactive)');
  console.error('  npx @tailorhub/skills add <github-skill-url> [--target claude|codex|opencode|all]');
  console.error('  npx @tailorhub/skills update [skill-name] [--target claude|codex|opencode|all]');
  console.error('  npx @tailorhub/skills remove <skill-name> [--target claude|codex|opencode|all]');
  console.error('');
  console.error('Defaults:');
  console.error('  --target all (installs/updates Claude Code, Codex, and OpenCode)');
  console.error('');
  console.error('Examples:');
  console.error('  npx @tailorhub/skills');
  console.error('  npx @tailorhub/skills add https://github.com/TailorHub-Mad/ai-skills/tailor-code-review');
  console.error('  npx @tailorhub/skills add https://github.com/TailorHub-Mad/ai-skills/tailor-code-review --target opencode');
  console.error('  npx @tailorhub/skills update');
  console.error('  npx @tailorhub/skills update tailor-code-review --target claude');
  console.error('  npx @tailorhub/skills remove tailor-code-review --target all');
}

function parseCliArgs(argv) {
  const args = [...argv];
  const positionals = [];
  let target = 'all';

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (token === '--target') {
      const value = args[i + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --target. Use claude, codex, opencode, or all.');
      }
      if (!VALID_TARGETS.has(value)) {
        throw new Error(`Invalid --target value "${value}". Use claude, codex, opencode, or all.`);
      }
      target = value;
      i += 1;
      continue;
    }

    if (token.startsWith('--')) {
      throw new Error(`Unknown flag: ${token}`);
    }

    positionals.push(token);
  }

  const [command, arg] = positionals;
  return { command, arg, target, positionals };
}

function resolveTargets(target) {
  if (target === 'all' || target === 'both') return Object.keys(TARGET_CONFIG);
  return [target];
}

function parseSkillUrl(url) {
  const parsed = new URL(url);
  const segments = parsed.pathname.split('/').filter(Boolean);
  // segments: ['owner', 'repo', 'skill']
  if (segments.length < 3) {
    throw new Error('Invalid skill URL. Expected format: https://github.com/<owner>/<repo>/<skill>');
  }
  const [owner, repo, ...rest] = segments;
  const skill = rest.join('/');
  return { owner, repo, skill };
}

function getSkillInstallDir(target, skillName) {
  const skillsRoot = TARGET_CONFIG[target].skillsRoot;
  const resolvedRoot = path.resolve(skillsRoot);
  const resolvedSkillDir = path.resolve(skillsRoot, skillName);
  const rootPrefix = `${resolvedRoot}${path.sep}`;

  // A skill name must resolve to a child directory, never the skills root itself.
  if (resolvedSkillDir === resolvedRoot || !resolvedSkillDir.startsWith(rootPrefix)) {
    throw new Error(`Invalid skill name "${skillName}"`);
  }

  return resolvedSkillDir;
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
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, data);
}

async function fetchGithubContents(owner, repo, repoPath) {
  const encodedPath = repoPath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  const body = await httpsGet(apiUrl);
  const files = JSON.parse(body.toString());

  if (!Array.isArray(files)) {
    throw new Error(`Unexpected response from GitHub API for path "${repoPath}"`);
  }

  return files;
}

async function downloadGithubDirectoryRecursive({ owner, repo, repoPath, destDir, relativePath = '' }) {
  const listPath = relativePath ? `${repoPath}/${relativePath}` : repoPath;
  const entries = await fetchGithubContents(owner, repo, listPath);

  for (const entry of entries) {
    if (entry.type === 'file') {
      const entryRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      const destPath = path.join(destDir, entryRelativePath);
      console.log(`  Downloading ${entryRelativePath}...`);
      await downloadFile(entry.download_url, destPath);
      continue;
    }

    if (entry.type === 'dir') {
      const childRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      fs.mkdirSync(path.join(destDir, childRelativePath), { recursive: true });
      await downloadGithubDirectoryRecursive({ owner, repo, repoPath, destDir, relativePath: childRelativePath });
    }
  }
}

async function installSkillToTarget({ owner, repo, skill, sourceUrl, target }) {
  const targetConfig = TARGET_CONFIG[target];
  const installDir = getSkillInstallDir(target, skill);
  const repoSkillPath = `skills/${skill}`;

  console.log(`Fetching skill "${skill}" from ${owner}/${repo} for ${target}...`);
  fs.mkdirSync(installDir, { recursive: true });

  try {
    await downloadGithubDirectoryRecursive({ owner, repo, repoPath: repoSkillPath, destDir: installDir });
  } catch (err) {
    throw new Error(`Could not fetch skill from GitHub API: ${err.message}`);
  }

  const sourceMeta = { url: sourceUrl, owner, repo, skill };
  fs.writeFileSync(path.join(installDir, '.source.json'), JSON.stringify(sourceMeta, null, 2));

  return installDir;
}

function getSourcePathForTarget(target, skillName) {
  return path.join(getSkillInstallDir(target, skillName), '.source.json');
}

function loadSourceForTarget(target, skillName) {
  const sourcePath = getSourcePathForTarget(target, skillName);
  if (!fs.existsSync(sourcePath)) {
    return { ok: false, reason: 'not_found' };
  }

  try {
    const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    return { ok: true, source };
  } catch {
    return { ok: false, reason: 'malformed_source' };
  }
}

async function updateSkillOnTarget({ target, skillName }) {
  const loaded = loadSourceForTarget(target, skillName);

  if (!loaded.ok) {
    if (loaded.reason === 'not_found') {
      return { status: 'not_found', target, skillName, message: `No source info found for "${skillName}" in ${target}.` };
    }
    return {
      status: 'failed',
      target,
      skillName,
      message: `Could not read source info for "${skillName}" in ${target}: malformed .source.json`,
    };
  }

  const { owner, repo, skill, url } = loaded.source;
  try {
    const installDir = await installSkillToTarget({ owner, repo, skill, sourceUrl: url, target });
    return { status: 'updated', target, skillName, installDir };
  } catch (err) {
    return { status: 'failed', target, skillName, message: err.message };
  }
}

function listUpdatableSkillsForTarget(target) {
  const skillsRoot = TARGET_CONFIG[target].skillsRoot;

  if (!fs.existsSync(skillsRoot)) {
    return [];
  }

  const entries = fs.readdirSync(skillsRoot, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => fs.existsSync(path.join(skillsRoot, name, '.source.json')));
}

function collectRestartTargets(results) {
  const shouldRestart = new Set();
  for (const result of results) {
    if (['installed', 'updated', 'removed'].includes(result.status)) {
      shouldRestart.add(result.target);
    }
  }
  return [...shouldRestart];
}

function printRestartHint(targets) {
  if (targets.length === 0) return;
  const labels = targets.map((t) => TARGET_CONFIG[t].label);
  console.log(`Restart ${labels.join(' and ')} to apply changes.`);
}

function summarizeTargetResults(results) {
  let okCount = 0;
  let failedCount = 0;

  for (const result of results) {
    if (['installed', 'updated', 'removed'].includes(result.status)) {
      okCount += 1;
      console.log(`  [${result.target}] ${result.status} -> ${result.installDir}/`);
      continue;
    }

    if (result.status === 'not_found') {
      console.log(`  [${result.target}] not found (${result.skillName})`);
      continue;
    }

    failedCount += 1;
    console.error(`  [${result.target}] failed: ${result.message}`);
  }

  return { okCount, failedCount };
}

function removeSkillOnTarget({ target, skillName }) {
  let installDir;
  try {
    installDir = getSkillInstallDir(target, skillName);
  } catch (err) {
    return { status: 'failed', target, skillName, message: err.message };
  }

  if (!fs.existsSync(installDir)) {
    return { status: 'not_found', target, skillName, message: `Skill "${skillName}" not found in ${target}.` };
  }

  try {
    fs.rmSync(installDir, { recursive: true, force: false });
    return { status: 'removed', target, skillName, installDir };
  } catch (err) {
    return { status: 'failed', target, skillName, message: err.message };
  }
}

async function addSkillMultiTarget({ sourceUrl, target }) {
  let parsed;
  try {
    parsed = parseSkillUrl(sourceUrl);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return false;
  }

  const { owner, repo, skill } = parsed;
  const targets = resolveTargets(target);
  const results = [];

  console.log(`Installing "${skill}" for targets: ${targets.join(', ')}`);

  for (const targetName of targets) {
    try {
      const installDir = await installSkillToTarget({ owner, repo, skill, sourceUrl, target: targetName });
      results.push({ status: 'installed', target: targetName, skillName: skill, installDir });
    } catch (err) {
      results.push({ status: 'failed', target: targetName, skillName: skill, message: err.message });
    }
  }

  console.log('\nResults:');
  const summary = summarizeTargetResults(results);
  printRestartHint(collectRestartTargets(results));

  if (summary.okCount === 0) {
    console.error(`Error: installation failed for all requested targets.`);
    return false;
  }

  if (summary.failedCount > 0) {
    console.log('Installation completed with partial success.');
  }

  return true;
}

async function updateNamedSkillMultiTarget({ skillName, target }) {
  const targets = resolveTargets(target);
  const results = [];

  console.log(`Updating "${skillName}" for targets: ${targets.join(', ')}`);

  for (const targetName of targets) {
    results.push(await updateSkillOnTarget({ target: targetName, skillName }));
  }

  console.log('\nResults:');
  const summary = summarizeTargetResults(results);
  printRestartHint(collectRestartTargets(results));

  if (summary.okCount === 0) {
    console.error('Error: update failed for all requested targets.');
    return false;
  }

  if (summary.failedCount > 0) {
    console.log('Update completed with partial success.');
  }

  return true;
}

function removeNamedSkillMultiTarget({ skillName, target }) {
  const targets = resolveTargets(target);
  const results = [];

  console.log(`Removing "${skillName}" for targets: ${targets.join(', ')}`);

  for (const targetName of targets) {
    results.push(removeSkillOnTarget({ target: targetName, skillName }));
  }

  console.log('\nResults:');
  const summary = summarizeTargetResults(results);
  printRestartHint(collectRestartTargets(results));

  if (summary.okCount === 0) {
    console.error('Error: remove failed for all requested targets.');
    return false;
  }

  if (summary.failedCount > 0) {
    console.log('Remove completed with partial success.');
  }

  return true;
}

async function updateAllSkillsMultiTarget({ target }) {
  const targets = resolveTargets(target);
  let anyUpdatable = false;
  let anySuccess = false;
  let totalUpdated = 0;
  let totalFailed = 0;
  const restartTargets = new Set();

  for (const targetName of targets) {
    const skillNames = listUpdatableSkillsForTarget(targetName);
    console.log(`\n[${targetName}] ${skillNames.length} updatable skill(s) found.`);

    if (skillNames.length === 0) {
      continue;
    }

    anyUpdatable = true;
    const results = [];
    for (const skillName of skillNames) {
      results.push(await updateSkillOnTarget({ target: targetName, skillName }));
    }

    const summary = summarizeTargetResults(results);
    totalUpdated += summary.okCount;
    totalFailed += summary.failedCount;
    if (summary.okCount > 0) {
      anySuccess = true;
      restartTargets.add(targetName);
    }
  }

  if (!anyUpdatable) {
    console.log('\nNo updatable skills found in the selected target(s).');
    console.log('Re-install skills with "npx @tailorhub/skills add <url>" to enable updates.');
    return true;
  }

  console.log(`\nDone. ${totalUpdated} updated, ${totalFailed} failed.`);
  printRestartHint([...restartTargets]);

  if (!anySuccess) {
    console.error('Error: no skill could be updated successfully.');
    return false;
  }

  return true;
}

const SKILLS_REPO = { owner: 'TailorHub-Mad', repo: 'ai-skills' };

function rlPrompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function fetchAvailableSkills() {
  const contents = await fetchGithubContents(SKILLS_REPO.owner, SKILLS_REPO.repo, 'skills');
  return contents.filter((e) => e.type === 'dir').map((e) => e.name);
}

async function fetchSkillDescription(skillName) {
  try {
    const contents = await fetchGithubContents(SKILLS_REPO.owner, SKILLS_REPO.repo, `skills/${skillName}/agents`);
    const yamlFile = contents.find((e) => e.name.endsWith('.yaml') || e.name.endsWith('.yml'));
    if (!yamlFile) return null;
    const data = await httpsGet(yamlFile.download_url);
    const match = data.toString().match(/short_description:\s*["']?(.+?)["']?\s*$/m);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

function parseSelection(input, total) {
  if (input.trim().toLowerCase() === 'all') {
    return Array.from({ length: total }, (_, i) => i);
  }
  return input
    .split(',')
    .map((s) => parseInt(s.trim(), 10) - 1)
    .filter((i) => Number.isInteger(i) && i >= 0 && i < total);
}

async function runInteractiveMode() {
  if (!process.stdin.isTTY) {
    printUsage();
    process.exit(1);
  }

  console.log('\nWelcome to TailorHub Skills!\n');
  process.stdout.write('Fetching available skills...');

  let skills;
  try {
    skills = await fetchAvailableSkills();
  } catch (err) {
    process.stdout.write('\n');
    console.error(`Error fetching skills: ${err.message}`);
    process.exit(1);
  }

  const descriptions = await Promise.all(skills.map(fetchSkillDescription));
  process.stdout.write('\n\n');

  if (skills.length === 0) {
    console.log('No skills available.');
    return;
  }

  console.log('Available skills:');
  const nameWidth = Math.max(...skills.map((s) => s.length));
  skills.forEach((name, i) => {
    const desc = descriptions[i] ? `  ${descriptions[i]}` : '';
    console.log(`  ${String(i + 1).padStart(2)}. ${name.padEnd(nameWidth)}${desc}`);
  });
  console.log('');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  let selectedIndices = [];
  while (selectedIndices.length === 0) {
    const selInput = await rlPrompt(rl, `Select skills to install (e.g. 1  or  1,2  or  all): `);
    selectedIndices = parseSelection(selInput, skills.length);
    if (selectedIndices.length === 0) {
      console.log('  No valid selection, try again.');
    }
  }

  const targetInput = await rlPrompt(rl, `Select target (claude/codex/opencode/all) [all]: `);
  rl.close();

  const target = targetInput.trim() || 'all';
  if (!VALID_TARGETS.has(target)) {
    console.error(`Invalid target "${target}". Use claude, codex, opencode, or all.`);
    process.exit(1);
  }

  console.log('');
  const baseUrl = `https://github.com/${SKILLS_REPO.owner}/${SKILLS_REPO.repo}`;

  for (const i of selectedIndices) {
    const ok = await addSkillMultiTarget({ sourceUrl: `${baseUrl}/${skills[i]}`, target });
    if (!ok) process.exit(1);
  }
}

async function main() {
  let parsed;
  try {
    parsed = parseCliArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    printUsage();
    process.exit(1);
  }

  const { command, arg, positionals, target } = parsed;

  if (!command) {
    await runInteractiveMode();
    return;
  }

  if (!['add', 'update', 'remove'].includes(command)) {
    printUsage();
    process.exit(1);
  }

  if (command === 'add') {
    if (!arg || positionals.length !== 2) {
      printUsage();
      process.exit(1);
    }

    const ok = await addSkillMultiTarget({ sourceUrl: arg, target });
    if (!ok) process.exit(1);
    return;
  }

  if (command === 'update') {
    if (positionals.length > 2) {
      printUsage();
      process.exit(1);
    }

    const ok = arg
      ? await updateNamedSkillMultiTarget({ skillName: arg, target })
      : await updateAllSkillsMultiTarget({ target });

    if (!ok) process.exit(1);
  }

  if (command === 'remove') {
    if (!arg || positionals.length !== 2) {
      printUsage();
      process.exit(1);
    }

    const ok = removeNamedSkillMultiTarget({ skillName: arg, target });
    if (!ok) process.exit(1);
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
