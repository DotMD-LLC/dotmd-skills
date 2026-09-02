# Install DotMD skills on five AI platforms

## Requirements

- Node.js 18 or newer;
- a supported AI client with Agent Skills support;
- a DotMD account;
- a browser for DotMD OAuth sign-in if you want the assistant to act on live

  DotMD content.

Review third-party skills before installing them. DotMD skills contain instructions, while the installer adds the public MCP endpoint and delegates sign-in to the client. It does not request, print, or persist OAuth tokens.

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

Install skills, add the MCP server, and open DotMD OAuth:

```bash
npx github:DotMD-LLC/dotmd-skills connect --platform codex
```

Codex stores MCP configuration for the current Codex host. `codex mcp add` detects DotMD OAuth and opens the browser during connection. ChatGPT desktop, Codex CLI, and the IDE extension share the host configuration.

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

Connect and authenticate:

```bash
npx github:DotMD-LLC/dotmd-skills connect --platform claude
```

The installer uses Claude Code's native HTTP MCP configuration and `claude mcp login dotmd`, which opens the DotMD OAuth flow in the browser.

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

Connect and authenticate:

```bash
npx github:DotMD-LLC/dotmd-skills connect --platform cursor
```

The installer safely merges the `dotmd` URL into `.cursor/mcp.json` or the user configuration. Cursor CLI users can run `agent mcp login dotmd`; in the editor, select Auth for the DotMD server. Both use native OAuth discovery.

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

Connect and authenticate:

```bash
npx github:DotMD-LLC/dotmd-skills connect --platform copilot
```

The installer safely merges DotMD into `.github/mcp.json` or the personal Copilot MCP configuration. Open that file and select Auth above the DotMD server, then approve the browser consent screen.

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

Connect, then authenticate inside Gemini CLI:

```bash
npx github:DotMD-LLC/dotmd-skills connect --platform gemini
gemini
# Then enter: /mcp auth dotmd
```

Gemini automatically discovers DotMD OAuth, opens a browser, and stores its own tokens after consent.

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

Skills teach the assistant how to work; MCP gives it an authorized connection to DotMD. The quickest path is:

```bash
npx github:DotMD-LLC/dotmd-skills connect --platform codex
```

1. Run `connect` for the client.
2. Review the MCP configuration path or native command printed by the CLI.
3. Complete DotMD sign-in and approve the requested access in the browser.
4. Start with a read-only request: “Use the DotMD skill to list my recent files.”
5. Confirm the account, namespace, and permissions before allowing edits.

Verify both skills and MCP configuration:

```bash
npx github:DotMD-LLC/dotmd-skills doctor --platform codex --mcp
```

Use `mcp login --platform <name>` to repeat a scriptable native OAuth flow. For Cursor, Copilot, and Gemini, follow the Auth instruction printed by the CLI.

## Update or repair

Run the install command again. Identical skills are left unchanged. If a local skill differs, the installer refuses to overwrite it; inspect your customization, then use `--force` only when replacement is intentional.

Preview first:

```bash
npx github:DotMD-LLC/dotmd-skills install --platform codex --dry-run
```