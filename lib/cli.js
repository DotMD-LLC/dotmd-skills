import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

import { installSkills, inspectSkills, PLATFORM_CONFIG, SKILL_NAMES } from './installer.js';
import { configureMcp, DEFAULT_MCP_ENDPOINT, inspectMcp, loginMcp } from './mcp/connect.js';

export const VERSION = '1.1.0';
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(packageRoot, 'skills');

export const HELP = `DotMD Skills ${VERSION}

Install official DotMD Agent Skills for leading AI platforms.

Usage:
  dotmd-skills install --platform <name|all> [options]
  dotmd-skills connect --platform <name|all> [options]
  dotmd-skills mcp configure --platform <name|all> [options]
  dotmd-skills mcp login --platform <name>
  dotmd-skills list
  dotmd-skills doctor --platform <name|all> [--global] [--mcp]
  dotmd-skills completion <bash|zsh|fish>

Install options:
  -p, --platform <name>  codex, claude, cursor, copilot, gemini, or all
  -s, --skill <name>     install one skill; repeat or comma-separate (default: all)
  -g, --global           install for the current user instead of this project
  -f, --force            replace an existing skill with different content
  -d, --dry-run          print the installation plan without writing files
      --endpoint <url>    DotMD MCP endpoint (default: ${DEFAULT_MCP_ENDPOINT})
      --mcp               include MCP configuration in doctor checks
  -h, --help             show help
  -v, --version          show version

Examples:
  npx github:DotMD-LLC/dotmd-skills install --platform codex
  npx github:DotMD-LLC/dotmd-skills install --platform claude --global
  npx github:DotMD-LLC/dotmd-skills install --platform all --skill dotmd --dry-run
`;

class MisuseError extends Error {
  constructor(message) {
    super(message);
    this.exitCode = 2;
  }
}

function readValue(args, index, flag) {
  const value = args[index + 1];
  if (!value || value.startsWith('-')) throw new MisuseError(`${flag} requires a value.`);
  return value;
}

export function parseInstallArgs(args) {
  const options = { platforms: [], skills: [], global: false, force: false, dryRun: false, endpoint: DEFAULT_MCP_ENDPOINT, mcp: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--platform' || arg === '-p') {
      options.platforms.push(...readValue(args, i, arg).split(',')); i += 1;
    } else if (arg === '--skill' || arg === '-s') {
      options.skills.push(...readValue(args, i, arg).split(',')); i += 1;
    } else if (arg === '--global' || arg === '-g') options.global = true;
    else if (arg === '--force' || arg === '-f') options.force = true;
    else if (arg === '--dry-run' || arg === '-d') options.dryRun = true;
    else if (arg === '--endpoint') { options.endpoint = readValue(args, i, arg); i += 1; }
    else if (arg === '--mcp') options.mcp = true;
    else throw new MisuseError(`Unknown option "${arg}". Run dotmd-skills --help.`);
  }
  if (options.platforms.includes('all')) options.platforms = Object.keys(PLATFORM_CONFIG);
  for (const platform of options.platforms) {
    if (!PLATFORM_CONFIG[platform]) {
      throw new MisuseError(`Unknown platform "${platform}". Choose: ${Object.keys(PLATFORM_CONFIG).join(', ')}.`);
    }
  }
  if (options.skills.length === 0) options.skills = [...SKILL_NAMES];
  return options;
}

async function promptPlatform() {
  const choices = Object.entries(PLATFORM_CONFIG).map(([id, item], index) => `${index + 1}. ${item.label} (${id})`).join('\n');
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await rl.question(`Choose a platform:\n${choices}\n6. All platforms\n> `);
    const index = Number(answer.trim());
    if (index === 6) return Object.keys(PLATFORM_CONFIG);
    const platform = Object.keys(PLATFORM_CONFIG)[index - 1];
    if (!platform) throw new MisuseError('Choose a number from 1 to 6.');
    return [platform];
  } finally {
    rl.close();
  }
}

function completions(shell) {
  const words = 'install connect mcp configure login list doctor completion --help --version --platform --skill --global --force --dry-run --endpoint --mcp codex claude cursor copilot gemini all';
  if (shell === 'bash') return `complete -W "${words}" dotmd-skills`;
  if (shell === 'zsh') return `compdef '_arguments "1: :(${words})"' dotmd-skills`;
  if (shell === 'fish') return words.split(' ').map((word) => `complete -c dotmd-skills -a '${word}'`).join('\n');
  throw new MisuseError('Unknown shell. Choose: bash, zsh, fish.');
}

function printInstallResult(result, dryRun, output) {
  const rows = dryRun ? result.planned : result.installed;
  for (const row of rows) output(`${dryRun ? 'Would install' : 'Installed'} ${row.skill} for ${row.platform}: ${row.file}`);
  for (const row of result.unchanged) output(`Already current ${row.skill} for ${row.platform}: ${row.file}`);
  output(`${dryRun ? result.planned.length + ' planned' : result.installed.length + ' installed'}, ${result.unchanged.length} unchanged.`);
}

export async function runCli(args, io = {}) {
  const output = io.output ?? ((message) => console.log(message));
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') { output(HELP.trimEnd()); return 0; }
  if (args[0] === '--version' || args[0] === '-v') { output(VERSION); return 0; }
  if (args[0] === 'list') {
    output(`Platforms:\n${Object.entries(PLATFORM_CONFIG).map(([id, p]) => `  ${id.padEnd(8)} ${p.label}`).join('\n')}\n\nSkills:\n${SKILL_NAMES.map((s) => `  ${s}`).join('\n')}`);
    return 0;
  }
  if (args[0] === 'completion') { output(completions(args[1])); return 0; }
  const mcpSubcommand = args[0] === 'mcp' ? args[1] : null;
  const command = mcpSubcommand ? `mcp ${mcpSubcommand}` : args[0];
  const supported = ['install', 'connect', 'doctor', 'mcp configure', 'mcp login'];
  if (!supported.includes(command)) throw new MisuseError(`Unknown command "${args[0]}". Run dotmd-skills --help.`);

  const options = parseInstallArgs(args.slice(mcpSubcommand ? 2 : 1));
  if (options.platforms.length === 0) {
    if (!stdin.isTTY || !stdout.isTTY) throw new MisuseError('--platform is required in non-interactive mode.');
    options.platforms = await promptPlatform();
  }
  const runtime = { ...options, sourceRoot, cwd: io.cwd ?? process.cwd(), home: io.home ?? homedir(), interactive: io.interactive ?? (stdin.isTTY && stdout.isTTY) };
  if (command === 'doctor') {
    const rows = await inspectSkills(runtime);
    for (const row of rows) output(`${row.installed ? 'OK     ' : 'MISSING'} ${row.platform}/${row.skill} ${row.file}`);
    let mcpHealthy = true;
    if (options.mcp) {
      const mcpRows = await inspectMcp(runtime);
      for (const row of mcpRows) output(`MCP ${row.configured ? 'OK     ' : 'MISSING'} ${row.platform} ${row.target}`);
      mcpHealthy = mcpRows.every((row) => row.configured);
    }
    return rows.every((row) => row.installed) && mcpHealthy ? 0 : 1;
  }
  if (command === 'mcp login') {
    if (options.platforms.length !== 1) throw new MisuseError('MCP login requires exactly one platform.');
    const rows = await loginMcp({ ...runtime, interactive: io.interactive ?? (stdin.isTTY && stdout.isTTY) });
    printMcpRows(rows, false, output);
    return 0;
  }
  if (command === 'mcp configure') {
    const rows = await configureMcp(runtime);
    printMcpRows(rows, options.dryRun, output);
    return 0;
  }
  if (command === 'connect') {
    const result = await installSkills(runtime);
    printInstallResult(result, options.dryRun, output);
    const configured = await configureMcp(runtime);
    printMcpRows(configured, options.dryRun, output);
    const pendingPlatforms = options.platforms.filter((platform) => !configured.some((row) => row.platform === platform && row.authStarted));
    if (pendingPlatforms.length > 0) {
      const loginRows = await loginMcp({ ...runtime, platforms: pendingPlatforms, interactive: pendingPlatforms.length === 1 && runtime.interactive });
      printMcpRows(loginRows, false, output);
    }
    return 0;
  }
  const result = await installSkills(runtime);
  printInstallResult(result, options.dryRun, output);
  return 0;
}

function printMcpRows(rows, dryRun, output) {
  for (const row of rows) {
    if (row.status === 'planned') output(`Would configure MCP for ${row.platform}.`);
    else if (row.status === 'configured') output(`Configured MCP for ${row.platform}${row.file ? `: ${row.file}` : '.'}`);
    else if (row.status === 'unchanged') output(`MCP already configured for ${row.platform}: ${row.file ?? row.target}`);
    else if (row.status === 'started') output(`OAuth started for ${row.platform}. Complete sign-in in your browser.`);
    else output(`${row.stage === 'configure' ? 'MCP' : 'OAuth'} next step for ${row.platform}: ${row.instruction}`);
  }
}

export function formatCliError(error) {
  return { message: `Error: ${error.message}`, exitCode: error.exitCode ?? 1 };
}
