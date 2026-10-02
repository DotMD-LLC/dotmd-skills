import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const bin = path.resolve('bin', 'dotmd-skills.js');

function run(args, options = {}) {
  return spawnSync(process.execPath, [bin, ...args], { encoding: 'utf8', ...options });
}

test('--help documents commands and non-interactive install flags', () => {
  const result = run(['--help']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /install/);
  assert.match(result.stdout, /doctor/);
  assert.match(result.stdout, /completion/);
  assert.match(result.stdout, /--platform/);
  assert.match(result.stdout, /--dry-run/);
  assert.match(result.stdout, /connect/);
  assert.match(result.stdout, /mcp configure/);
  assert.match(result.stdout, /--endpoint/);
});

test('connect dry run plans skill and MCP setup without requiring a client executable', () => {
  const result = run(['connect', '--platform', 'cursor', '--dry-run']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Would install dotmd for cursor/);
  assert.match(result.stdout, /Would configure MCP for cursor/);
  assert.match(result.stdout, /OAuth next step/i);
});

test('mcp configure rejects insecure non-loopback endpoints', () => {
  const result = run(['mcp', 'configure', '--platform', 'cursor', '--endpoint', 'http://example.com/mcp']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /HTTPS/i);
});

test('mcp login requires one platform', () => {
  const result = run(['mcp', 'login', '--platform', 'all']);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /one platform/i);
});

test('doctor with MCP reports missing configuration', () => {
  const result = run(['doctor', '--platform', 'cursor', '--mcp']);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /MCP MISSING.*cursor/i);
});

test('--version prints the package version', async () => {
  const packageMetadata = JSON.parse(await readFile(path.resolve('package.json'), 'utf8'));
  const result = run(['--version']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), packageMetadata.version);
});

test('list prints all platforms and skills', () => {
  const result = run(['list']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /codex/);
  assert.match(result.stdout, /gemini/);
  assert.match(result.stdout, /dotmd-github-sync/);
});

test('invalid platform exits with actionable misuse error', () => {
  const result = run(['install', '--platform', 'unknown']);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Unknown platform.*codex.*claude/i);
});

test('completion emits scripts for bash, zsh, and fish', () => {
  for (const shell of ['bash', 'zsh', 'fish']) {
    const result = run(['completion', shell]);
    assert.equal(result.status, 0, `${shell}: ${result.stderr}`);
    assert.match(result.stdout, /dotmd-skills/);
  }
});

test('doctor fails for stale skills and force repairs them without changing other files or MCP configuration', async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), 'dotmd-skills-cli-'));
  const install = run(['install', '--platform', 'cursor'], { cwd });
  assert.equal(install.status, 0, install.stderr);
  const staleFile = path.join(cwd, '.cursor', 'skills', 'dotmd', 'SKILL.md');
  const adjacentFile = path.join(cwd, '.cursor', 'skills', 'dotmd', 'notes.md');
  const unrelatedFile = path.join(cwd, '.cursor', 'skills', 'custom-skill', 'SKILL.md');
  const configFile = path.join(cwd, '.cursor', 'mcp.json');
  const configBytes = Buffer.from('{\n  "mcpServers": { "dotmd": { "url": "https://dotmd.co/api/mcp" }, "other": { "url": "https://example.com/mcp" } }\n}\n');
  await writeFile(staleFile, 'outdated local skill\n');
  await writeFile(adjacentFile, 'Keep these notes.\n');
  await mkdir(path.dirname(unrelatedFile), { recursive: true });
  await writeFile(unrelatedFile, 'Keep this custom skill.\n');
  await writeFile(configFile, configBytes);

  const doctor = run(['doctor', '--platform', 'cursor', '--mcp'], { cwd });
  assert.equal(doctor.status, 1, doctor.stderr);
  assert.match(doctor.stdout, /STALE\s+cursor\/dotmd\s/);
  assert.match(doctor.stdout, /install --platform cursor --force/);
  assert.equal(await readFile(staleFile, 'utf8'), 'outdated local skill\n');
  assert.deepEqual(await readFile(configFile), configBytes);

  const refused = run(['install', '--platform', 'cursor'], { cwd });
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /--force/);
  assert.equal(await readFile(staleFile, 'utf8'), 'outdated local skill\n');

  const repaired = run(['install', '--platform', 'cursor', '--force'], { cwd });
  assert.equal(repaired.status, 0, repaired.stderr);
  assert.deepEqual(await readFile(staleFile), await readFile(path.resolve('skills', 'dotmd', 'SKILL.md')));
  assert.equal(await readFile(adjacentFile, 'utf8'), 'Keep these notes.\n');
  assert.equal(await readFile(unrelatedFile, 'utf8'), 'Keep this custom skill.\n');
  assert.deepEqual(await readFile(configFile), configBytes);

  const healthy = run(['doctor', '--platform', 'cursor', '--mcp'], { cwd });
  assert.equal(healthy.status, 0, healthy.stderr);
  assert.doesNotMatch(healthy.stdout, /STALE|MISSING/);
});
