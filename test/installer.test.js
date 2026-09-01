import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  PLATFORM_CONFIG,
  SKILL_NAMES,
  installSkills,
  resolveTargetRoot,
} from '../lib/installer.js';

test('defines project and user paths for five platforms', () => {
  assert.deepEqual(Object.keys(PLATFORM_CONFIG), [
    'codex',
    'claude',
    'cursor',
    'copilot',
    'gemini',
  ]);
  assert.equal(PLATFORM_CONFIG.codex.project, path.join('.agents', 'skills'));
  assert.equal(PLATFORM_CONFIG.claude.user, path.join('.claude', 'skills'));
  assert.equal(PLATFORM_CONFIG.cursor.project, path.join('.cursor', 'skills'));
  assert.equal(PLATFORM_CONFIG.copilot.user, path.join('.copilot', 'skills'));
  assert.equal(PLATFORM_CONFIG.gemini.project, path.join('.gemini', 'skills'));
});

test('resolves project and user targets without hardcoded home paths', () => {
  assert.equal(
    resolveTargetRoot('codex', { cwd: '/project', home: '/home/user', global: false }),
    path.resolve('/project', '.agents', 'skills'),
  );
  assert.equal(
    resolveTargetRoot('gemini', { cwd: '/project', home: '/home/user', global: true }),
    path.resolve('/home/user', '.gemini', 'skills'),
  );
});

test('installs selected skills and verifies their bytes', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-skills-test-'));
  const sourceRoot = path.join(root, 'source');
  const cwd = path.join(root, 'project');
  await mkdir(path.join(sourceRoot, 'dotmd'), { recursive: true });
  await writeFile(path.join(sourceRoot, 'dotmd', 'SKILL.md'), 'skill-content\n');

  const result = await installSkills({
    platforms: ['codex'],
    skills: ['dotmd'],
    sourceRoot,
    cwd,
    home: path.join(root, 'home'),
  });

  assert.equal(result.installed.length, 1);
  assert.equal(result.unchanged.length, 0);
  assert.equal(
    await readFile(path.join(cwd, '.agents', 'skills', 'dotmd', 'SKILL.md'), 'utf8'),
    'skill-content\n',
  );
});

test('dry run plans installs without writing', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-skills-test-'));
  const sourceRoot = path.join(root, 'source');
  await mkdir(path.join(sourceRoot, 'dotmd'), { recursive: true });
  await writeFile(path.join(sourceRoot, 'dotmd', 'SKILL.md'), 'skill-content\n');

  const result = await installSkills({
    platforms: ['claude'],
    skills: ['dotmd'],
    sourceRoot,
    cwd: path.join(root, 'project'),
    home: path.join(root, 'home'),
    dryRun: true,
  });

  assert.equal(result.planned.length, 1);
  await assert.rejects(readFile(result.planned[0].file, 'utf8'), /ENOENT/);
});

test('refuses to overwrite different content without force', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-skills-test-'));
  const sourceRoot = path.join(root, 'source');
  const cwd = path.join(root, 'project');
  const target = path.join(cwd, '.cursor', 'skills', 'dotmd');
  await mkdir(path.join(sourceRoot, 'dotmd'), { recursive: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(sourceRoot, 'dotmd', 'SKILL.md'), 'new\n');
  await writeFile(path.join(target, 'SKILL.md'), 'existing\n');

  await assert.rejects(
    installSkills({
      platforms: ['cursor'],
      skills: ['dotmd'],
      sourceRoot,
      cwd,
      home: path.join(root, 'home'),
    }),
    /already exists with different content.*--force/i,
  );
  assert.equal(await readFile(path.join(target, 'SKILL.md'), 'utf8'), 'existing\n');
});

test('force replaces different content and identical content is unchanged', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-skills-test-'));
  const sourceRoot = path.join(root, 'source');
  const cwd = path.join(root, 'project');
  await mkdir(path.join(sourceRoot, 'dotmd'), { recursive: true });
  await writeFile(path.join(sourceRoot, 'dotmd', 'SKILL.md'), 'new\n');

  const first = await installSkills({
    platforms: ['copilot'], skills: ['dotmd'], sourceRoot, cwd,
    home: path.join(root, 'home'), force: true,
  });
  const second = await installSkills({
    platforms: ['copilot'], skills: ['dotmd'], sourceRoot, cwd,
    home: path.join(root, 'home'),
  });

  assert.equal(first.installed.length, 1);
  assert.equal(second.unchanged.length, 1);
});

test('exports exactly the six published skill names', () => {
  assert.deepEqual(SKILL_NAMES, [
    'dotmd',
    'dotmd-docs',
    'dotmd-slides',
    'dotmd-sheets',
    'dotmd-collaboration',
    'dotmd-github-sync',
  ]);
});
