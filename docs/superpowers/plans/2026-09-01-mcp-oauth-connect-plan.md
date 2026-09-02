# DotMD MCP OAuth Connect Implementation Plan

1. Add failing CLI tests for `connect`, `mcp configure`, `mcp login`, MCP
   options, help, completion, and misuse errors.
2. Add failing unit tests for endpoint validation, project/user platform plans,
   scope selection, and native OAuth handoffs.
3. Add failing JSON configuration tests for preservation, idempotency,
   conflicts, forced replacement, malformed input, dry-run, and atomic writes.
4. Implement isolated MCP config, platform adapter, JSON merge, and orchestration
   modules until the focused tests pass.
5. Connect the modules to the CLI without changing existing install signatures.
6. Extend `doctor --mcp`, README, platform guides, and shell completions.
7. Run the complete test, Markdown, packaging, clean-install, configuration, and
   public GitHub npx smoke gates.
8. Review the public diff for secrets and private-repository disclosure, commit,
   merge to `main`, push, and publish a new GitHub release.
