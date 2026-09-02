# DotMD MCP OAuth Connect Design

## Goal

Extend the public `dotmd-skills` CLI so one command can install DotMD skills,
configure the public DotMD MCP endpoint, and hand authentication to each AI
client's native OAuth flow.

The package must never collect, print, copy, or persist OAuth access or refresh
tokens. Client-owned OAuth storage remains client-owned.

## User experience

The primary command is:

```bash
npx github:DotMD-LLC/dotmd-skills connect --platform codex
```

It performs three ordered stages:

1. Install all six DotMD skills for the selected platform.
2. Add a `dotmd` Streamable HTTP MCP server pointing to
   `https://dotmd.co/api/mcp`.
3. Start the platform's native OAuth login when a supported non-interactive
   command exists. Otherwise, print the exact native Auth action to complete.

`--platform all`, `--global`, and `--dry-run` are supported. OAuth consent
remains authoritative; the CLI cannot silently grant access. A universal
scope override is intentionally omitted because native clients do not expose a
consistent way to constrain dynamically discovered scopes.

## Commands

```text
dotmd-skills connect --platform <name|all> [options]
dotmd-skills mcp configure --platform <name|all> [options]
dotmd-skills mcp login --platform <name>
dotmd-skills doctor --platform <name|all> [--mcp]
```

`connect` composes the existing skill install with MCP configuration and login.
The `mcp` subcommands allow users to repeat only the MCP stages. `mcp login`
accepts one platform because OAuth is an interactive, per-client operation.

## Platform adapters

Each client is isolated behind an adapter that declares configuration scope,
merge format, native login capability, and verification guidance.

| Platform | Configuration | OAuth handoff |
| --- | --- | --- |
| Codex | Native `codex mcp add dotmd --url ...` | `codex mcp login dotmd` |
| Claude Code | Native `claude mcp add --transport http ...` | `claude mcp login dotmd` |
| Cursor | Merge `.cursor/mcp.json` or `~/.cursor/mcp.json` | `agent mcp login dotmd` when available; otherwise Cursor Auth UI |
| GitHub Copilot | Merge `.github/mcp.json` or `~/.copilot/mcp-config.json` | Copilot MCP Auth action or `/mcp` UI |
| Gemini CLI | Native `gemini mcp add dotmd ... --transport http` | Open Gemini and use `/mcp auth dotmd` |

Native client commands are preferred because they preserve client-specific
schema evolution. JSON is merged only where the client has no suitable add
command. Existing unrelated settings and MCP servers are preserved.

## Safe configuration rules

- Never write bearer tokens, OAuth codes, refresh tokens, client secrets, or
  session cookies.
- Never modify a malformed configuration file; report its path and parse error.
- Never replace a conflicting `dotmd` entry without `--force`.
- Identical configuration is idempotent and reported as unchanged.
- `--dry-run` performs no writes, process launches, or browser launches.
- Configuration files are written atomically through a sibling temporary file
  and rename.
- Command execution uses argument arrays without shell interpolation.
- The endpoint defaults to `https://dotmd.co/api/mcp`. A custom `--endpoint`
  must be an absolute HTTPS URL, except loopback HTTP for local development.
- OAuth starts only after configuration succeeds and only in an interactive
  terminal. Codex may begin OAuth as part of its native add command; the CLI
  detects that and does not launch a duplicate login. Non-interactive runs
  print the next command and exit successfully.

## OAuth behavior

DotMD exposes standard MCP OAuth discovery. Compatible clients discover the
authorization server, dynamically register a public client, use PKCE, open the
DotMD sign-in and consent screen, exchange the authorization code, and retain
their own tokens.

The installer does not implement an OAuth client and does not inspect client
credential stores. This keeps the package independent of private client token
formats and lets each platform apply its security controls and refresh logic.

## Architecture

The existing skill installer remains unchanged. New modules are:

- `lib/mcp/config.js`: endpoint validation, conflict policy, object-level JSON
  merge, and atomic write.
- `lib/mcp/platforms.js`: adapter definitions and native command builders.
- `lib/mcp/connect.js`: orchestration with injected filesystem, process, and
  TTY dependencies for deterministic tests.

`lib/cli.js` parses commands and renders results but contains no platform file
logic. Platform adapters return structured actions so dry runs, tests, and real
execution share one plan.

## Error handling

Failures are stage-specific and actionable: missing client executable,
malformed configuration, conflicting `dotmd` server, unsupported OAuth launch,
client command failure, or MCP verification failure. A missing executable does
not undo installed skills; the summary states which stage completed and gives
the manual command or file path.

No automatic rollback touches pre-existing configuration. A newly created
temporary file is removed after a failed atomic write.

## Testing

Development follows red-green-refactor. Automated tests cover:

- parsing every new command, option, scope, and invalid combination;
- endpoint validation, including HTTPS and loopback exceptions;
- all five platform plans at project and user scope;
- correct native command argument arrays;
- JSON merge preservation, idempotency, conflict refusal, and forced replace;
- malformed JSON refusal and atomic-write cleanup;
- dry-run prohibition on writes, commands, and browser launches;
- interactive and non-interactive OAuth handoff behavior;
- `doctor --mcp` configuration detection;
- existing skill installation behavior without regressions.

Release verification runs the full package check, packs the tarball, installs
all 30 skill files in a clean directory, configures MCP for all five adapters
using isolated fixtures and fake executables, and verifies the public GitHub
command. Live OAuth is verified against DotMD through a real client and browser
without recording credentials or bypassing sign-in protections.

## Documentation and release

The README will lead with the one-command connect flow and explain that OAuth
opens in the user's browser. The five-platform guide will document each native
fallback and revocation path. The release will be a new version and GitHub
release; npm registry publication remains separate until npm publishing 2FA is
available.
