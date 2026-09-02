import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  mergeJsonMcpConfig,
  validateMcpEndpoint,
} from '../lib/mcp/config.js';

test('accepts HTTPS and loopback HTTP MCP endpoints', () => {
  assert.equal(validateMcpEndpoint('https://dotmd.co/api/mcp'), 'https://dotmd.co/api/mcp');
  assert.equal(validateMcpEndpoint('http://localhost:3000/api/mcp'), 'http://localhost:3000/api/mcp');
  assert.equal(validateMcpEndpoint('http://127.0.0.1:3000/api/mcp'), 'http://127.0.0.1:3000/api/mcp');
});

test('rejects insecure remote and malformed MCP endpoints', () => {
  assert.throws(() => validateMcpEndpoint('http://example.com/api/mcp'), /HTTPS/i);
  assert.throws(() => validateMcpEndpoint('not-a-url'), /absolute URL/i);
  assert.throws(() => validateMcpEndpoint('https://user:secret@dotmd.co/api/mcp'), /credentials/i);
});

test('merges an MCP server without changing unrelated JSON settings', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-mcp-config-'));
  const file = path.join(root, '.cursor', 'mcp.json');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify({ theme: 'dark', mcpServers: { existing: { command: 'x' } } }, null, 2));

  const result = await mergeJsonMcpConfig({
    file,
    rootKey: 'mcpServers',
    entry: { url: 'https://dotmd.co/api/mcp' },
  });

  assert.equal(result.status, 'configured');
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), {
    theme: 'dark',
    mcpServers: {
      existing: { command: 'x' },
      dotmd: { url: 'https://dotmd.co/api/mcp' },
    },
  });
});

test('is idempotent and refuses a conflicting dotmd server unless forced', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-mcp-config-'));
  const file = path.join(root, 'mcp.json');
  await writeFile(file, JSON.stringify({ mcpServers: { dotmd: { url: 'https://other.example/mcp' } } }));

  await assert.rejects(
    mergeJsonMcpConfig({ file, rootKey: 'mcpServers', entry: { url: 'https://dotmd.co/api/mcp' } }),
    /already has a different.*--force/i,
  );
  assert.equal(JSON.parse(await readFile(file, 'utf8')).mcpServers.dotmd.url, 'https://other.example/mcp');

  const replaced = await mergeJsonMcpConfig({
    file,
    rootKey: 'mcpServers',
    entry: { url: 'https://dotmd.co/api/mcp' },
    force: true,
  });
  const unchanged = await mergeJsonMcpConfig({
    file,
    rootKey: 'mcpServers',
    entry: { url: 'https://dotmd.co/api/mcp' },
  });
  assert.equal(replaced.status, 'configured');
  assert.equal(unchanged.status, 'unchanged');
});

test('dry run and malformed JSON never write configuration', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-mcp-config-'));
  const missing = path.join(root, 'missing', 'mcp.json');
  const planned = await mergeJsonMcpConfig({
    file: missing,
    rootKey: 'mcpServers',
    entry: { url: 'https://dotmd.co/api/mcp' },
    dryRun: true,
  });
  assert.equal(planned.status, 'planned');
  await assert.rejects(readFile(missing), /ENOENT/);

  const malformed = path.join(root, 'bad.json');
  await writeFile(malformed, '{ broken');
  await assert.rejects(
    mergeJsonMcpConfig({ file: malformed, rootKey: 'mcpServers', entry: { url: 'https://dotmd.co/api/mcp' } }),
    /valid JSON/i,
  );
  assert.equal(await readFile(malformed, 'utf8'), '{ broken');
});
