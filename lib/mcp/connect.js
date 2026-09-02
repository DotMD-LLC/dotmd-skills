import { spawn } from 'node:child_process';

import { hasJsonMcpConfig, mergeJsonMcpConfig, validateMcpEndpoint } from './config.js';
import { buildMcpPlan } from './platforms.js';

export const DEFAULT_MCP_ENDPOINT = 'https://dotmd.co/api/mcp';

function printable(command, args) {
  return [command, ...args].map((part) => /\s/.test(part) ? JSON.stringify(part) : part).join(' ');
}

function redactSecrets(value) {
  return String(value)
    .replace(/(Authorization\s*:\s*Bearer\s+)[^\s"']+/gi, '$1[REDACTED]')
    .replace(/\bdotmd_(?:sk_(?:live|test)|at|rt)_[A-Za-z0-9._~-]+\b/g, '[REDACTED]');
}

export function executeClientCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.interactive ? 'inherit' : ['ignore', 'pipe', 'pipe'],
      shell: false,
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.setEncoding('utf8');
    child.stdout?.on('data', (chunk) => { stdout += chunk; });
    child.stderr?.setEncoding('utf8');
    child.stderr?.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

async function runCommandAction(action, execute, platform, stage) {
  try {
    const result = await execute(action.command, action.args, { interactive: stage === 'login' });
    if (result.code !== 0) {
      throw new Error(`${platform} MCP ${stage} failed: ${redactSecrets(result.stderr?.trim() || `exit ${result.code}`)}`);
    }
    return { platform, status: stage === 'login' ? 'started' : 'configured' };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { platform, status: 'manual', stage, instruction: printable(action.command, action.args) };
    }
    throw error;
  }
}

export async function configureMcp(options) {
  const endpoint = validateMcpEndpoint(options.endpoint ?? DEFAULT_MCP_ENDPOINT);
  const execute = options.execute ?? executeClientCommand;
  const rows = [];
  for (const platform of options.platforms) {
    const plan = buildMcpPlan(platform, { ...options, endpoint });
    if (options.dryRun) {
      rows.push({ platform, status: 'planned', action: plan.configure });
    } else if (plan.configure.kind === 'json') {
      const result = await mergeJsonMcpConfig({ ...plan.configure, force: options.force, dryRun: false });
      rows.push({ platform, ...result });
    } else {
      if (plan.configure.authOnConfigure && options.interactive === false) {
        rows.push({ platform, status: 'manual', stage: 'configure', instruction: printable(plan.configure.command, plan.configure.args), authStarted: false });
        continue;
      }
      const existing = await inspectNativePlan(plan, execute, endpoint);
      if (existing.configured) {
        rows.push({ platform, status: 'unchanged', authStarted: false, target: printable(plan.verify.command, plan.verify.args) });
        continue;
      }
      if (existing.exists) {
        if (!options.force) {
          throw new Error(`${platform} already has a different dotmd MCP server. Re-run with --force to replace it.`);
        }
        await runCommandAction(plan.remove, execute, platform, 'remove');
      }
      const row = await runCommandAction(plan.configure, execute, platform, 'configure');
      rows.push({ ...row, authStarted: Boolean(plan.configure.authOnConfigure) });
    }
  }
  return rows;
}

async function inspectNativePlan(plan, execute, endpoint) {
  try {
    const result = await execute(plan.verify.command, plan.verify.args, { interactive: false });
    const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
    const exists = result.code === 0 && output.includes('dotmd');
    return { exists, configured: exists && output.includes(endpoint) };
  } catch (error) {
    if (error.code === 'ENOENT') return { exists: false, configured: false };
    throw error;
  }
}

export async function loginMcp(options) {
  const endpoint = validateMcpEndpoint(options.endpoint ?? DEFAULT_MCP_ENDPOINT);
  const execute = options.execute ?? executeClientCommand;
  const rows = [];
  for (const platform of options.platforms) {
    const action = buildMcpPlan(platform, { ...options, endpoint }).login;
    if (action.kind === 'instruction') {
      rows.push({ platform, status: 'manual', stage: 'login', instruction: action.instruction });
    } else if (options.dryRun || !options.interactive) {
      rows.push({ platform, status: 'manual', stage: 'login', instruction: printable(action.command, action.args) });
    } else {
      rows.push(await runCommandAction(action, execute, platform, 'login'));
    }
  }
  return rows;
}

export async function inspectMcp(options) {
  const endpoint = validateMcpEndpoint(options.endpoint ?? DEFAULT_MCP_ENDPOINT);
  const execute = options.execute ?? executeClientCommand;
  const rows = [];
  for (const platform of options.platforms) {
    const verify = buildMcpPlan(platform, { ...options, endpoint }).verify;
    if (verify.kind === 'json') {
      rows.push({ platform, configured: await hasJsonMcpConfig(verify), target: verify.file });
      continue;
    }
    try {
      const result = await execute(verify.command, verify.args, { interactive: false });
      const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
      rows.push({
        platform,
        configured: result.code === 0 && output.includes('dotmd') && output.includes(endpoint),
        target: printable(verify.command, verify.args),
      });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      rows.push({ platform, configured: false, target: printable(verify.command, verify.args) });
    }
  }
  return rows;
}
