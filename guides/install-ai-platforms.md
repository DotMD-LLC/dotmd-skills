# Install DotMD skills on five AI platforms

## Requirements

- Node.js 18 or newer;
- a supported AI client with Agent Skills support;
- a DotMD account;
- a DotMD MCP connection if you want the assistant to act on live DotMD content.

Review third-party skills before installing them. These DotMD skills contain instructions only; they do not contain credentials or connect an account by themselves.

## OpenAI Codex and ChatGPT desktop

Install for the current project:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform codex
```

Install for your user account:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform codex --global
```

The installer writes project skills under `.agents/skills` and user skills under `~/.agents/skills`. Restart Codex if newly created skill directories do not appear. In Codex CLI or the IDE extension, use `/skills` or type `$dotmd`. In ChatGPT desktop, open Skills in the sidebar. Standalone skill availability depends on the current ChatGPT/Codex surface.

Verify files:

```bash
npx github:DotMD-LLC/dotmd-skills doctor --platform codex
```

Official reference: [OpenAI — Build skills](https://developers.openai.com/codex/build-skills).

## Claude Code

Project install:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform claude
```

User install:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform claude --global
```

The installer uses `.claude/skills` for the project or `~/.claude/skills` for the user. Claude Code watches existing skill directories for changes; restart it if the top-level directory was created after the session began. Ask Claude to “use the dotmd skill” or enter `/dotmd` when available.

Official reference: [Anthropic — Extend Claude with skills](https://code.claude.com/docs/en/skills).

## Cursor

Project install:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform cursor
```

User install:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform cursor --global
```

The installer uses `.cursor/skills` for the project or `~/.cursor/skills` for the user. Open or reload the project, then ask Cursor Agent to use the DotMD skill appropriate to the task. Cursor can discover nested project skills as it works in those directories.

Official reference: [Cursor — Agent Skills](https://cursor.com/docs/skills).

## GitHub Copilot

Project install:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform copilot
```

Personal install:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform copilot --global
```

The installer uses `.github/skills` for project skills and `~/.copilot/skills` for personal skills. Open Copilot Chat in agent mode and invoke a skill with `/dotmd` or ask Copilot to use it. Depending on your editor and rollout, skill support or a dedicated skill tool may need to be enabled.

Official references: [GitHub — About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) and [VS Code — Use Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills).

## Gemini CLI

Workspace install:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform gemini
```

User install:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform gemini --global
```

The installer uses `.gemini/skills` for the workspace or `~/.gemini/skills` for the user. In Gemini CLI, run `/skills reload`, then `/skills list`. Ask Gemini to use a named DotMD skill; it can also activate a matching enabled skill automatically.

Official reference: [Gemini CLI — Managing Agent Skills](https://geminicli.com/docs/cli/using-agent-skills/).

## Install everywhere or select skills

Install all DotMD skills for all five clients in the current project:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform all
```

Install only Docs and collaboration skills:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform codex \
  --skill dotmd-docs \
  --skill dotmd-collaboration
```

On PowerShell, place the command on one line or use PowerShell's backtick continuation instead of `\`.

## Connect the client to live DotMD

Skills teach the assistant how to work; MCP gives it an authorized connection to DotMD.

1. Open DotMD and go to **Settings → Apps & MCP**.
2. Follow the instructions shown for your AI client.
3. Prefer OAuth when offered. Otherwise create a narrowly scoped API key.
4. Never save a key inside a skill, repository, prompt example, or screenshot.
5. Start with a read-only request: “Use the DotMD skill to list my recent files.”
6. Confirm the account, namespace, and permissions before allowing edits.

## Update or repair

Run the install command again. Identical skills are left unchanged. If a local skill differs, the installer refuses to overwrite it; inspect your customization, then use `--force` only when replacement is intentional.

Preview first:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform codex --dry-run
```
