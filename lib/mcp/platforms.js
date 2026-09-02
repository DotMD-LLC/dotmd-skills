import path from 'node:path';

function command(commandName, args) {
  return { kind: 'command', command: commandName, args };
}

function json(file, rootKey, entry) {
  return { kind: 'json', file, rootKey, entry };
}

export function buildMcpPlan(platform, options) {
  const endpoint = options.endpoint;
  const cwd = options.cwd;
  const home = options.home;
  const global = Boolean(options.global);

  if (platform === 'codex') {
    return {
      platform,
      configure: { ...command('codex', ['mcp', 'add', 'dotmd', '--url', endpoint]), authOnConfigure: true },
      remove: command('codex', ['mcp', 'remove', 'dotmd']),
      login: command('codex', ['mcp', 'login', 'dotmd']),
      verify: { ...command('codex', ['mcp', 'get', 'dotmd', '--json']), match: 'dotmd' },
    };
  }
  if (platform === 'claude') {
    return {
      platform,
      configure: command('claude', ['mcp', 'add', '--transport', 'http', '--scope', global ? 'user' : 'project', 'dotmd', endpoint]),
      remove: command('claude', ['mcp', 'remove', '--scope', global ? 'user' : 'project', 'dotmd']),
      login: command('claude', ['mcp', 'login', 'dotmd']),
      verify: { ...command('claude', ['mcp', 'list']), match: 'dotmd' },
    };
  }
  if (platform === 'cursor') {
    return {
      platform,
      configure: json(path.resolve(global ? home : cwd, '.cursor', 'mcp.json'), 'mcpServers', { url: endpoint }),
      login: command('agent', ['mcp', 'login', 'dotmd']),
      verify: json(path.resolve(global ? home : cwd, '.cursor', 'mcp.json'), 'mcpServers', { url: endpoint }),
    };
  }
  if (platform === 'copilot') {
    const file = global
      ? path.resolve(home, '.copilot', 'mcp-config.json')
      : path.resolve(cwd, '.github', 'mcp.json');
    return {
      platform,
      configure: json(file, global ? 'mcpServers' : 'servers', { type: 'http', url: endpoint }),
      login: { kind: 'instruction', instruction: 'Open the DotMD entry in Copilot MCP configuration and select Auth.' },
      verify: json(file, global ? 'mcpServers' : 'servers', { type: 'http', url: endpoint }),
    };
  }
  if (platform === 'gemini') {
    return {
      platform,
      configure: command('gemini', ['mcp', 'add', 'dotmd', endpoint, '--transport', 'http', '--scope', global ? 'user' : 'project']),
      remove: command('gemini', ['mcp', 'remove', 'dotmd', '--scope', global ? 'user' : 'project']),
      login: { kind: 'instruction', instruction: 'Open Gemini CLI and run /mcp auth dotmd.' },
      verify: { ...command('gemini', ['mcp', 'list']), match: 'dotmd' },
    };
  }
  throw new Error(`Unknown platform "${platform}".`);
}
