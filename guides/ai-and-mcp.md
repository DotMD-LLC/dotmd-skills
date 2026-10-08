# AI and MCP

DotMD supports AI-assisted work in the editor and connections from compatible AI clients through the Model Context Protocol (MCP).

## Built-in AI editing

Open the AI surface, describe the outcome, and select the relevant content when the request is local. DotMD presents AI-assisted changes for review. Check accuracy, tone, links, and formatting before accepting.

## Bring your own provider

Where available, configure a supported AI provider or compatible endpoint in Settings. Choose the provider and model intentionally. Content sent for a request is processed under that provider's terms, so do not send material your policy forbids.

## Connect an MCP client

For Codex, Claude Code, Cursor, GitHub Copilot, or Gemini CLI, install the skills and configure MCP together:

```bash
npx github:DotMD-LLC/dotmd-skills connect --platform codex
```

Replace `codex` with the client ID you use. The CLI configures the public DotMD Streamable HTTP endpoint, then starts or explains that client's native OAuth action. Tokens remain in the client credential store; the skills package does not request, print, or persist them.

1. In DotMD, open **Settings → Apps & MCP** or the equivalent current settings area.
2. Use the connection instructions shown for your client.
3. Prefer OAuth when the client and DotMD offer it; otherwise create a narrowly scoped API key.
4. Give the client the DotMD MCP endpoint shown in Settings.
5. Review the requested access and authorize the correct account.
6. Test with a read-only request such as listing or finding a known item.
7. Revoke the connected app or key when it is no longer needed.

Never paste an API key or OAuth token into a document, issue, prompt library, shell history, screenshot, or repository.

## What an assistant can help with

Depending on access and current capabilities, an assistant can help find and organize files; create and edit Docs, Slides, Sheets, or Arts; review content; work with comments and mentions; manage folders; export supported artifacts; and coordinate GitHub-synced Markdown.

Read [MCP workflows](mcp-workflows.md) for current tool routing and web-only boundaries. The `dotmd_guide` tool explains `overview`, `docs`, `slides`, `sheets`, `arts`, `charts`, `blog`, `collaboration`, and `sharing` with examples. Tool names may have a client-specific prefix; inspect the connected schemas instead of inventing a tool or action.

For procedural 3D Arts, discover `art_runtime_list` and `art_starter` when advertised. Use the exact approved runtime declaration returned by the tool. Starters prepare a package without calling a model or saving it. The web app saves starters and AI proposals through **Accept Art**; MCP `art_generate` canonicalizes supplied content, while `art_create` and revision-aware `art_update` save explicitly.

Discover Arts PNG/standalone HTML exports and owner-only `art_embedding` in the connected catalog before using them. Export targets the accepted revision; embedding grants no access and does not publish. These skills and their local package checks describe a source/package candidate. Hosted web, MCP, and renderer deployment and npm publication are separate release states.

For public DotMD articles, use `blog_list` followed by `blog_read`. These are read-only discovery tools. Publishing a customer document does not automatically register it in the public blog feed.

## Prompt contract

For reliable work, state:

- the exact target or search scope;
- the intended outcome and audience;
- whether the assistant may read, comment, edit, create, share, publish, restore, or delete;
- constraints such as length, style, format, and deadline;
- the evidence or summary you expect at the end.

## Permission model

Connected AI operates as the authorized user or credential and remains subject to DotMD permissions. Read-only credentials cannot write, and a read-write credential still needs access to the target. Namespace membership, individual shares, folder/general access, link access, and public publishing are distinct. Private content remains owner-only until access is explicitly granted.

Destructive and access-changing operations require explicit user intent. An instruction that already names the action, target, and audience supplies that authorization; clarify missing scope before acting.
