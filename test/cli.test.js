import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';

const bin = path.resolve('bin', 'dotmd-skills.js');

function run(args) {
  return spawnSync(process.execPath, [bin, ...args], { encoding: 'utf8' });
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

test('--version prints the package version', () => {
  const result = run(['--version']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), '1.1.0');
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
