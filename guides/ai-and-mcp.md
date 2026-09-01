# AI and MCP

DotMD supports AI-assisted work in the editor and connections from compatible AI clients through the Model Context Protocol (MCP).

## Built-in AI editing

Open the AI surface, describe the outcome, and select the relevant content when the request is local. DotMD presents AI-assisted changes for review. Check accuracy, tone, links, and formatting before accepting.

## Bring your own provider

Where available, configure a supported AI provider or compatible endpoint in Settings. Choose the provider and model intentionally. Content sent for a request is processed under that provider's terms, so do not send material your policy forbids.

## Connect an MCP client

1. In DotMD, open **Settings → Apps & MCP** or the equivalent current settings area.
2. Use the connection instructions shown for your client.
3. Prefer OAuth when the client and DotMD offer it; otherwise create a narrowly scoped API key.
4. Give the client the DotMD MCP endpoint shown in Settings.
5. Review the requested access and authorize the correct account.
6. Test with a read-only request such as listing or finding a known item.
7. Revoke the connected app or key when it is no longer needed.

Never paste an API key into a document, issue, prompt library, shell history, screenshot, or repository.

## What an assistant can help with

Depending on access and current capabilities, an assistant can help find and organize files; create and edit Docs, Slides, or Sheets; review content; work with comments and mentions; manage folders; export artifacts; and coordinate GitHub-synced Markdown.

## Prompt contract

For reliable work, state:

- the exact target or search scope;
- the intended outcome and audience;
- whether the assistant may read, comment, edit, create, share, publish, restore, or delete;
- constraints such as length, style, format, and deadline;
- the evidence or summary you expect at the end.

## Permission model

Connected AI does not gain universal access. It operates as the authorized user or credential and remains subject to DotMD permissions. Treat destructive and access-changing operations as confirmation-required even if a client can technically call them.
