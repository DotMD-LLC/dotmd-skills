import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { configureMcp, inspectMcp, loginMcp } from '../lib/mcp/connect.js';

const endpoint = 'https://dotmd.co/api/mcp';

test('dry run plans every platform without writes or process execution', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-mcp-connect-'));
  let executions = 0;
  const rows = await configureMcp({
    platforms: ['codex', 'claude', 'cursor', 'copilot', 'gemini'],
    endpoint,
    cwd: root,
    home: path.join(root, 'home'),
    dryRun: true,
    execute: async () => { executions += 1; return { code: 0 }; },
  });
  assert.equal(rows.length, 5);
  assert.ok(rows.every((row) => row.status === 'planned'));
  assert.equal(executions, 0);
  await assert.rejects(readFile(path.join(root, '.cursor', 'mcp.json')), /ENOENT/);
});

test('executes native configure commands as argument arrays', async () => {
  const calls = [];
  const rows = await configureMcp({
    platforms: ['codex', 'claude'], endpoint, cwd: '/project', home: '/home/user',
    execute: async (command, args) => {
      calls.push({ command, args });
      if (args.includes('get') || args.includes('list')) return { code: 1, stdout: '', stderr: 'not found' };
      return { code: 0 };
    },
  });
  assert.equal(rows.every((row) => row.status === 'configured'), true);
  assert.deepEqual(calls[1], { command: 'codex', args: ['mcp', 'add', 'dotmd', '--url', endpoint] });
  assert.equal(calls[3].command, 'claude');
  assert.equal(rows[0].authStarted, true);
  assert.equal(rows[1].authStarted, false);
});

test('reports a missing client with its manual command instead of hiding the completed skill stage', async () => {
  const rows = await configureMcp({
    platforms: ['gemini'], endpoint, cwd: '/project', home: '/home/user',
    execute: async () => { const error = new Error('missing'); error.code = 'ENOENT'; throw error; },
  });
  assert.equal(rows[0].status, 'manual');
  assert.equal(rows[0].stage, 'configure');
  assert.match(rows[0].instruction, /gemini mcp add dotmd/);
});

test('does not launch configure-time OAuth in a non-interactive process', async () => {
  const rows = await configureMcp({
    platforms: ['codex'], endpoint, cwd: '/project', home: '/home/user', interactive: false,
    execute: async () => { throw new Error('must not execute'); },
  });
  assert.equal(rows[0].status, 'manual');
  assert.match(rows[0].instruction, /codex mcp add dotmd/);
});

test('leaves an identical native MCP server unchanged on repeat', async () => {
  const calls = [];
  const rows = await configureMcp({
    platforms: ['claude'], endpoint, cwd: '/project', home: '/home/user',
    execute: async (command, args) => {
      calls.push({ command, args });
      return { code: 0, stdout: `dotmd ${endpoint}` };
    },
  });
  assert.equal(rows[0].status, 'unchanged');
  assert.deepEqual(calls, [{ command: 'claude', args: ['mcp', 'list'] }]);
});

test('refuses conflicting native MCP configuration and force removes it before add', async () => {
  await assert.rejects(
    configureMcp({
      platforms: ['claude'], endpoint, cwd: '/project', home: '/home/user',
      execute: async () => ({ code: 0, stdout: 'dotmd https://old.example/mcp' }),
    }),
    /different.*--force/i,
  );

  const calls = [];
  await configureMcp({
    platforms: ['claude'], endpoint, cwd: '/project', home: '/home/user', force: true,
    execute: async (command, args) => {
      calls.push({ command, args });
      if (args.includes('list')) return { code: 0, stdout: 'dotmd https://old.example/mcp' };
      return { code: 0 };
    },
  });
  assert.deepEqual(calls.map((call) => call.args), [
    ['mcp', 'list'],
    ['mcp', 'remove', '--scope', 'project', 'dotmd'],
    ['mcp', 'add', '--transport', 'http', '--scope', 'project', 'dotmd', endpoint],
  ]);
});

test('starts native OAuth only for an interactive single-platform login', async () => {
  const calls = [];
  const rows = await loginMcp({
    platforms: ['codex'], endpoint, cwd: '/project', home: '/home/user', interactive: true,
    execute: async (command, args) => { calls.push({ command, args }); return { code: 0 }; },
  });
  assert.deepEqual(calls, [{ command: 'codex', args: ['mcp', 'login', 'dotmd'] }]);
  assert.equal(rows[0].status, 'started');
});

test('returns native OAuth instructions in non-interactive and in-client flows', async () => {
  const codex = await loginMcp({
    platforms: ['codex'], endpoint, cwd: '/project', home: '/home/user', interactive: false,
    execute: async () => { throw new Error('must not execute'); },
  });
  const gemini = await loginMcp({
    platforms: ['gemini'], endpoint, cwd: '/project', home: '/home/user', interactive: true,
    execute: async () => { throw new Error('must not execute'); },
  });
  assert.match(codex[0].instruction, /codex mcp login dotmd/);
  assert.match(gemini[0].instruction, /\/mcp auth dotmd/);
});

test('surfaces native command failures with stderr', async () => {
  await assert.rejects(
    configureMcp({
      platforms: ['codex'], endpoint, cwd: '/project', home: '/home/user',
      execute: async () => ({ code: 1, stderr: 'server already exists' }),
    }),
    /server already exists/,
  );
});

test('redacts credentials from native client failures', async () => {
  await assert.rejects(
    configureMcp({
      platforms: ['codex'], endpoint, cwd: '/project', home: '/home/user',
      execute: async () => ({ code: 1, stderr: `Authorization: Bearer ${['dotmd', 'sk', 'live', 'secretvalue'].join('_')}` }),
    }),
    (error) => {
      assert.doesNotMatch(error.message, /secretvalue/);
      assert.match(error.message, /REDACTED/);
      return true;
    },
  );
});

test('doctor verifies JSON configuration content and native client output', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-mcp-connect-'));
  await configureMcp({ platforms: ['cursor'], endpoint, cwd: root, home: path.join(root, 'home') });
  const rows = await inspectMcp({
    platforms: ['cursor', 'codex'], endpoint, cwd: root, home: path.join(root, 'home'),
    execute: async () => ({ code: 0, stdout: JSON.stringify({ name: 'dotmd', url: endpoint }) }),
  });
  assert.deepEqual(rows.map((row) => row.configured), [true, true]);
});

test('doctor rejects a native DotMD server configured for a different endpoint', async () => {
  const rows = await inspectMcp({
    platforms: ['codex'], endpoint, cwd: '/project', home: '/home/user',
    execute: async () => ({ code: 0, stdout: '{"name":"dotmd","url":"https://old.example/mcp"}' }),
  });
  assert.equal(rows[0].configured, false);
});

test('doctor rejects stale JSON and missing native client configuration', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-mcp-connect-'));
  const file = path.join(root, '.cursor', 'mcp.json');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify({ mcpServers: { dotmd: { url: 'https://old.example/mcp' } } }));
  const rows = await inspectMcp({
    platforms: ['cursor', 'codex'], endpoint, cwd: root, home: path.join(root, 'home'),
    execute: async () => ({ code: 1, stdout: '', stderr: 'not found' }),
  });
  assert.deepEqual(rows.map((row) => row.configured), [false, false]);
});
