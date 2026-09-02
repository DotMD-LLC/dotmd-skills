# DotMD skills npx installer design

## Goal

Make the six public DotMD Agent Skills installable with one `npx` command and document setup for OpenAI Codex, Claude Code, Cursor, GitHub Copilot, and Gemini CLI.

## Package contract

The npm package is named `dotmd-skills` and exposes a `dotmd-skills` binary. It contains the public skill folders and a zero-runtime-dependency Node.js CLI.

```text
npx dotmd-skills install --platform <codex|claude|cursor|copilot|gemini|all>
npx dotmd-skills list
npx dotmd-skills doctor --platform <name>
npx dotmd-skills completion <bash|zsh|fish>
```

Installation is project-local by default. `--global` selects the documented user-level directory. `--skill` selects one or more skills; omission installs all. `--dry-run` prints the plan, and `--force` permits replacement. Existing differing content is never overwritten implicitly.

## Platform locations

| Platform | Project | User |
| --- | --- | --- |
| OpenAI Codex | `.agents/skills` | `~/.agents/skills` |
| Claude Code | `.claude/skills` | `~/.claude/skills` |
| Cursor | `.cursor/skills` | `~/.cursor/skills` |
| GitHub Copilot | `.github/skills` | `~/.copilot/skills` |
| Gemini CLI | `.gemini/skills` | `~/.gemini/skills` |

These paths follow each platform's current official Agent Skills documentation. The guides link to those sources so path changes are maintainable.

## Architecture

- `bin/dotmd-skills.js`: process boundary, signal handling, and exit codes.
- `lib/cli.js`: argument parsing and help/version/list/doctor/completion dispatch.
- `lib/installer.js`: platform resolution, validation, copy planning, collision handling, and verification.
- `test/*.test.js`: Node test runner coverage for paths, parsing, safe installation, dry runs, force behavior, doctor, help, and package contents.

The CLI uses only Node built-ins to keep `npx` startup and supply-chain surface small.

## Failure behavior

Invalid platforms, skills, scopes, or arguments exit with an actionable error. Existing different files require `--force`. A partial copy is reported as failure; installed files are verified against packaged source bytes before success is printed.

## Publishing and verification

Run tests, CLI smoke tests, Markdown lint, link/frontmatter/disclosure checks, `npm pack --dry-run`, install from the tarball into temporary project and user directories, and verify every copied skill. Publish only if the npm name is available and the authenticated npm account has authority. After publishing, install from the registry in a fresh temporary directory and compare the installed skill set.