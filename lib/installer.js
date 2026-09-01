import { access, copyFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export const PLATFORM_CONFIG = Object.freeze({
  codex: { label: 'OpenAI Codex', project: path.join('.agents', 'skills'), user: path.join('.agents', 'skills') },
  claude: { label: 'Claude Code', project: path.join('.claude', 'skills'), user: path.join('.claude', 'skills') },
  cursor: { label: 'Cursor', project: path.join('.cursor', 'skills'), user: path.join('.cursor', 'skills') },
  copilot: { label: 'GitHub Copilot', project: path.join('.github', 'skills'), user: path.join('.copilot', 'skills') },
  gemini: { label: 'Gemini CLI', project: path.join('.gemini', 'skills'), user: path.join('.gemini', 'skills') },
});

export const SKILL_NAMES = Object.freeze([
  'dotmd',
  'dotmd-docs',
  'dotmd-slides',
  'dotmd-sheets',
  'dotmd-collaboration',
  'dotmd-github-sync',
]);

async function fileExists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export function resolveTargetRoot(platform, options) {
  const config = PLATFORM_CONFIG[platform];
  if (!config) throw new Error(`Unknown platform: ${platform}`);
  return path.resolve(options.global ? options.home : options.cwd, options.global ? config.user : config.project);
}

export function validateSelection(platforms, skills) {
  for (const platform of platforms) {
    if (!PLATFORM_CONFIG[platform]) {
      throw new Error(`Unknown platform "${platform}". Choose: ${Object.keys(PLATFORM_CONFIG).join(', ')}.`);
    }
  }
  for (const skill of skills) {
    if (!SKILL_NAMES.includes(skill)) {
      throw new Error(`Unknown skill "${skill}". Choose: ${SKILL_NAMES.join(', ')}.`);
    }
  }
}

export async function installSkills(options) {
  const platforms = [...new Set(options.platforms)];
  const skills = [...new Set(options.skills)];
  validateSelection(platforms, skills);
  const result = { installed: [], unchanged: [], planned: [] };

  for (const platform of platforms) {
    const targetRoot = resolveTargetRoot(platform, options);
    for (const skill of skills) {
      const source = path.join(options.sourceRoot, skill, 'SKILL.md');
      const file = path.join(targetRoot, skill, 'SKILL.md');
      const sourceBytes = await readFile(source);

      if (options.dryRun) {
        result.planned.push({ platform, skill, file });
        continue;
      }

      if (await fileExists(file)) {
        const targetBytes = await readFile(file);
        if (sourceBytes.equals(targetBytes)) {
          result.unchanged.push({ platform, skill, file });
          continue;
        }
        if (!options.force) {
          throw new Error(`${file} already exists with different content. Re-run with --force to replace it.`);
        }
      }

      await mkdir(path.dirname(file), { recursive: true });
      await copyFile(source, file);
      const installedBytes = await readFile(file);
      if (!sourceBytes.equals(installedBytes)) {
        throw new Error(`Verification failed after writing ${file}.`);
      }
      result.installed.push({ platform, skill, file });
    }
  }
  return result;
}

export async function inspectSkills(options) {
  const platforms = [...new Set(options.platforms)];
  validateSelection(platforms, SKILL_NAMES);
  const rows = [];
  for (const platform of platforms) {
    const targetRoot = resolveTargetRoot(platform, options);
    for (const skill of SKILL_NAMES) {
      rows.push({ platform, skill, file: path.join(targetRoot, skill, 'SKILL.md'), installed: await fileExists(path.join(targetRoot, skill, 'SKILL.md')) });
    }
  }
  return rows;
}
