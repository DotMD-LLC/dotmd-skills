import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import { buildMcpPlan } from '../lib/mcp/platforms.js';

const endpoint = 'https://dotmd.co/api/mcp';
const roots = { cwd: path.resolve('/project'), home: path.resolve('/home/user') };

test('builds native MCP configure and OAuth login commands for Codex', () => {
  const plan = buildMcpPlan('codex', { ...roots, endpoint, global: true });
  assert.deepEqual(plan.configure, {
    kind: 'command', command: 'codex', args: ['mcp', 'add', 'dotmd', '--url', endpoint], authOnConfigure: true,
  });
  assert.deepEqual(plan.login, {
    kind: 'command', command: 'codex', args: ['mcp', 'login', 'dotmd'],
  });
  assert.deepEqual(plan.remove, {
    kind: 'command', command: 'codex', args: ['mcp', 'remove', 'dotmd'],
  });
  assert.deepEqual(plan.verify, {
    kind: 'command', command: 'codex', args: ['mcp', 'get', 'dotmd', '--json'], match: 'dotmd',
  });
});

test('builds native project and user MCP commands for Claude Code and Gemini CLI', () => {
  assert.deepEqual(
    buildMcpPlan('claude', { ...roots, endpoint, global: false }).configure.args,
    ['mcp', 'add', '--transport', 'http', '--scope', 'project', 'dotmd', endpoint],
  );
  assert.deepEqual(
    buildMcpPlan('claude', { ...roots, endpoint, global: false }).remove.args,
    ['mcp', 'remove', '--scope', 'project', 'dotmd'],
  );
  assert.deepEqual(
    buildMcpPlan('gemini', { ...roots, endpoint, global: true }).remove.args,
    ['mcp', 'remove', 'dotmd', '--scope', 'user'],
  );
  assert.deepEqual(
    buildMcpPlan('claude', { ...roots, endpoint, global: false }).verify,
    { kind: 'command', command: 'claude', args: ['mcp', 'list'], match: 'dotmd' },
  );
  assert.deepEqual(
    buildMcpPlan('gemini', { ...roots, endpoint, global: true }).configure.args,
    ['mcp', 'add', 'dotmd', endpoint, '--transport', 'http', '--scope', 'user'],
  );
});

test('builds Cursor JSON configuration and native OAuth login', () => {
  const project = buildMcpPlan('cursor', { ...roots, endpoint, global: false });
  const user = buildMcpPlan('cursor', { ...roots, endpoint, global: true });
  assert.equal(project.configure.file, path.resolve('/project', '.cursor', 'mcp.json'));
  assert.equal(user.configure.file, path.resolve('/home/user', '.cursor', 'mcp.json'));
  assert.equal(project.configure.rootKey, 'mcpServers');
  assert.deepEqual(project.configure.entry, { url: endpoint });
  assert.deepEqual(project.login, { kind: 'command', command: 'agent', args: ['mcp', 'login', 'dotmd'] });
  assert.equal(project.verify.kind, 'json');
});

test('builds Copilot project and user configuration in each supported schema', () => {
  const project = buildMcpPlan('copilot', { ...roots, endpoint, global: false });
  const user = buildMcpPlan('copilot', { ...roots, endpoint, global: true });
  assert.equal(project.configure.file, path.resolve('/project', '.github', 'mcp.json'));
  assert.equal(project.configure.rootKey, 'servers');
  assert.deepEqual(project.configure.entry, { type: 'http', url: endpoint });
  assert.equal(user.configure.file, path.resolve('/home/user', '.copilot', 'mcp-config.json'));
  assert.equal(user.configure.rootKey, 'mcpServers');
});

test('uses native Claude OAuth and in-client guidance where no scriptable login exists', () => {
  assert.deepEqual(buildMcpPlan('claude', { ...roots, endpoint }).login, {
    kind: 'command', command: 'claude', args: ['mcp', 'login', 'dotmd'],
  });
  assert.match(buildMcpPlan('copilot', { ...roots, endpoint }).login.instruction, /Auth/i);
  assert.match(buildMcpPlan('gemini', { ...roots, endpoint }).login.instruction, /\/mcp auth dotmd/);
});

test('rejects unknown MCP platforms', () => {
  assert.throws(() => buildMcpPlan('unknown', { ...roots, endpoint }), /Unknown platform/i);
});
