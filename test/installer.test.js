import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  PLATFORM_CONFIG,
  SKILL_NAMES,
  inspectSkills,
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

test('installs the Arts skill byte-for-byte across all five platforms', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-skills-test-'));
  const sourceRoot = path.join(root, 'source');
  const cwd = path.join(root, 'project');
  const skillBytes = Buffer.from('---\r\nname: dotmd-arts\r\n---\r\nCreate a visual café mock.\n');
  await mkdir(path.join(sourceRoot, 'dotmd-arts'), { recursive: true });
  await writeFile(path.join(sourceRoot, 'dotmd-arts', 'SKILL.md'), skillBytes);

  const result = await installSkills({
    platforms: ['codex', 'claude', 'cursor', 'copilot', 'gemini'],
    skills: ['dotmd-arts'],
    sourceRoot,
    cwd,
    home: path.join(root, 'home'),
  });

  assert.equal(result.installed.length, 5);
  for (const target of ['.agents', '.claude', '.cursor', '.github', '.gemini']) {
    assert.deepEqual(await readFile(path.join(cwd, target, 'skills', 'dotmd-arts', 'SKILL.md')), skillBytes);
  }
});

test('the default catalog installs all seven published skills', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-skills-test-'));
  const sourceRoot = path.join(root, 'source');
  const publishedSkills = ['dotmd', 'dotmd-docs', 'dotmd-slides', 'dotmd-sheets', 'dotmd-arts', 'dotmd-collaboration', 'dotmd-github-sync'];
  for (const skill of publishedSkills) {
    await mkdir(path.join(sourceRoot, skill), { recursive: true });
    await writeFile(path.join(sourceRoot, skill, 'SKILL.md'), `${skill}\n`);
  }

  const result = await installSkills({
    platforms: ['codex'], skills: SKILL_NAMES, sourceRoot,
    cwd: path.join(root, 'project'), home: path.join(root, 'home'),
  });

  assert.equal(result.installed.length, 7);
  for (const skill of publishedSkills) {
    assert.equal(await readFile(path.join(root, 'project', '.agents', 'skills', skill, 'SKILL.md'), 'utf8'), `${skill}\n`);
  }
});

test('inspection distinguishes current bytes, stale bytes, and missing files without writing', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dotmd-skills-test-'));
  const sourceRoot = path.join(root, 'source');
  const cwd = path.join(root, 'project');
  for (const skill of ['dotmd', 'dotmd-docs', 'dotmd-slides', 'dotmd-sheets', 'dotmd-arts', 'dotmd-collaboration', 'dotmd-github-sync']) {
    await mkdir(path.join(sourceRoot, skill), { recursive: true });
    await writeFile(path.join(sourceRoot, skill, 'SKILL.md'), 'current\n');
  }
  const currentFile = path.join(cwd, '.agents', 'skills', 'dotmd', 'SKILL.md');
  const staleFile = path.join(cwd, '.agents', 'skills', 'dotmd-docs', 'SKILL.md');
  await mkdir(path.dirname(currentFile), { recursive: true });
  await mkdir(path.dirname(staleFile), { recursive: true });
  await writeFile(currentFile, 'current\n');
  await writeFile(staleFile, 'current\r\n');

  const rows = await inspectSkills({ platforms: ['codex'], sourceRoot, cwd, home: path.join(root, 'home') });

  const current = rows.find((row) => row.skill === 'dotmd');
  const stale = rows.find((row) => row.skill === 'dotmd-docs');
  const missing = rows.find((row) => row.skill === 'dotmd-arts');
  assert.deepEqual({ installed: current.installed, current: current.current }, { installed: true, current: true });
  assert.deepEqual({ installed: stale.installed, current: stale.current }, { installed: true, current: false });
  assert.deepEqual({ installed: missing.installed, current: missing.current }, { installed: false, current: false });
  assert.equal(await readFile(staleFile, 'utf8'), 'current\r\n');
  await assert.rejects(readFile(path.join(cwd, '.agents', 'skills', 'dotmd-arts', 'SKILL.md')), /ENOENT/);
});
