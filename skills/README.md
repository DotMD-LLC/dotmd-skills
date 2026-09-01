# DotMD AI skills

| Skill | Best for |
| --- | --- |
| [dotmd](dotmd/SKILL.md) | General DotMD routing and safety |
| [dotmd-docs](dotmd-docs/SKILL.md) | Drafting, editing, and reviewing Docs |
| [dotmd-slides](dotmd-slides/SKILL.md) | Presentation narratives and deck QA |
| [dotmd-sheets](dotmd-sheets/SKILL.md) | Structured data, formulas, and charts |
| [dotmd-collaboration](dotmd-collaboration/SKILL.md) | Comments, mentions, roles, and review |
| [dotmd-github-sync](dotmd-github-sync/SKILL.md) | GitHub-connected Markdown workflows |

## Use a skill

Install all skills into the current project:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform codex
```

Supported platform IDs are `codex`, `claude`, `cursor`, `copilot`, and `gemini`. Add `--global` for a user-wide install, or `--skill dotmd-docs` to install one skill. Run `npx github:DotMD-LLC/dotmd-skills list` for the full catalogue and `npx github:DotMD-LLC/dotmd-skills doctor --platform codex` to verify discovery files.

See [Install on five AI platforms](../guides/install-ai-platforms.md) for client-specific activation and verification.

These files describe behavior; they do not contain credentials or grant access. Connect your assistant to DotMD separately through the supported Apps & MCP flow.
