import { access, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export function validateMcpEndpoint(value) {
  let endpoint;
  try {
    endpoint = new URL(value);
  } catch {
    throw new Error('MCP endpoint must be an absolute URL.');
  }
  const loopback = endpoint.hostname === 'localhost' || endpoint.hostname === '127.0.0.1' || endpoint.hostname === '::1';
  if (endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && loopback)) {
    throw new Error('MCP endpoint must use HTTPS. Loopback HTTP is allowed for local development.');
  }
  if (endpoint.username || endpoint.password) {
    throw new Error('MCP endpoint must not contain embedded credentials.');
  }
  return endpoint.href.replace(/\/$/, '');
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export async function mergeJsonMcpConfig(options) {
  const current = await exists(options.file)
    ? await readConfig(options.file)
    : {};
  const servers = current[options.rootKey] ?? {};
  if (typeof servers !== 'object' || Array.isArray(servers)) {
    throw new Error(`${options.file} has an invalid ${options.rootKey} object.`);
  }
  const existing = servers.dotmd;
  if (existing && sameJson(existing, options.entry)) return { status: 'unchanged', file: options.file };
  if (existing && !options.force) {
    throw new Error(`${options.file} already has a different dotmd server. Re-run with --force to replace it.`);
  }
  if (options.dryRun) return { status: 'planned', file: options.file };

  const next = { ...current, [options.rootKey]: { ...servers, dotmd: options.entry } };
  await mkdir(path.dirname(options.file), { recursive: true });
  const temporary = `${options.file}.dotmd-skills-${process.pid}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, { flag: 'wx' });
    await rename(temporary, options.file);
  } catch (error) {
    await unlink(temporary).catch(() => undefined);
    throw error;
  }
  return { status: 'configured', file: options.file };
}

export async function hasJsonMcpConfig(options) {
  if (!await exists(options.file)) return false;
  const current = await readConfig(options.file);
  return sameJson(current[options.rootKey]?.dotmd, options.entry);
}

async function readConfig(file) {
  const source = await readFile(file, 'utf8');
  try {
    return JSON.parse(source);
  } catch {
    throw new Error(`${file} must contain valid JSON before DotMD MCP can be configured.`);
  }
}
