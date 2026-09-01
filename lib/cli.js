import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

import { installSkills, inspectSkills, PLATFORM_CONFIG, SKILL_NAMES } from './installer.js';

export const VERSION = '1.0.0';
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(packageRoot, 'skills');

export const HELP = `DotMD Skills ${VERSION}

Install official DotMD Agent Skills for leading AI platforms.

Usage:
  dotmd-skills install --platform <name|all> [options]
  dotmd-skills list
  dotmd-skills doctor --platform <name|all> [--global]
  dotmd-skills completion <bash|zsh|fish>

Install options:
  -p, --platform <name>  codex, claude, cursor, copilot, gemini, or all
  -s, --skill <name>     install one skill; repeat or comma-separate (default: all)
  -g, --global           install for the current user instead of this project
  -f, --force            replace an existing skill with different content
  -d, --dry-run          print the installation plan without writing files
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
  const options = { platforms: [], skills: [], global: false, force: false, dryRun: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--platform' || arg === '-p') {
      options.platforms.push(...readValue(args, i, arg).split(',')); i += 1;
    } else if (arg === '--skill' || arg === '-s') {
      options.skills.push(...readValue(args, i, arg).split(',')); i += 1;
    } else if (arg === '--global' || arg === '-g') options.global = true;
    else if (arg === '--force' || arg === '-f') options.force = true;
    else if (arg === '--dry-run' || arg === '-d') options.dryRun = true;
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
  const words = 'install list doctor completion --help --version --platform --skill --global --force --dry-run codex claude cursor copilot gemini all';
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
  if (args[0] !== 'install' && args[0] !== 'doctor') throw new MisuseError(`Unknown command "${args[0]}". Run dotmd-skills --help.`);

  const options = parseInstallArgs(args.slice(1));
  if (options.platforms.length === 0) {
    if (!stdin.isTTY || !stdout.isTTY) throw new MisuseError('--platform is required in non-interactive mode.');
    options.platforms = await promptPlatform();
  }
  const runtime = { ...options, sourceRoot, cwd: io.cwd ?? process.cwd(), home: io.home ?? homedir() };
  if (args[0] === 'doctor') {
    const rows = await inspectSkills(runtime);
    for (const row of rows) output(`${row.installed ? 'OK     ' : 'MISSING'} ${row.platform}/${row.skill} ${row.file}`);
    return rows.every((row) => row.installed) ? 0 : 1;
  }
  const result = await installSkills(runtime);
  printInstallResult(result, options.dryRun, output);
  return 0;
}

export function formatCliError(error) {
  return { message: `Error: ${error.message}`, exitCode: error.exitCode ?? 1 };
}
