# DotMD Docs

DotMD Docs combines a visual editor with portable Markdown.

## Write and structure

- Use headings to create a clear hierarchy.
- Use lists for steps and decisions.
- Use tables for compact comparisons.
- Add links, quotations, code, callouts, and media where they improve comprehension.
- Type `/` on an empty line to open available block commands.
- Use the toolbar when you prefer direct formatting controls.

## Work in the view you need

Depending on the current editor surface, you can work with the editable document, Markdown-oriented views, or a rendered preview. Preview before sharing or exporting when layout matters.

## Find and revise

- Use `Ctrl+F` or `Cmd+F` for find and replace in the editor.
- Select a focused passage before asking AI to rewrite it.
- Use comments when you want discussion rather than an immediate edit.
- Review headings and links after large moves or imports.

## Add richer content

DotMD can represent structured Markdown content such as tables, code blocks, diagrams, footnotes, images, and supported embeds. Availability and rendering can vary by content type and client, so preview the document before publishing.

## Export

Export Markdown when portability and source control matter. Use document or PDF-style exports when the recipient needs a finished artifact. Always open the exported file once before sending it.

## Recommended AI pattern

1. Tell the assistant the audience and goal.
2. Point it to the exact Doc or selected passage.
3. State whether it may edit, comment, or only advise.
4. Ask for a change summary.
5. Review facts, links, tone, and formatting.

Use the [DotMD Docs skill](../skills/dotmd-docs/SKILL.md).

## Through MCP

Create a Doc with `file_create` and `type: "doc"`, supplying initial Markdown in the same call. For an existing Doc, use `file_get` for metadata, `file_read` for content, then `apply_edits` for a focused change. Anchors use visible plain text within one text leaf, without Markdown markers. A `modify` replaces text within that node; it does not replace a whole multi-block section. An `add` inserts rich Markdown after its block, but appends at the document end if the anchor is missing. Check the intended anchor before insertion and the placement afterwards.

For a review that should leave comments, read existing discussion with `comments_list`, then use `doc_review` for a batch of quoted notes. Check the returned anchor results: an ambiguous quote can leave a document-level comment instead of an inline highlight.

Use `dotmd_guide` with `topic: "docs"` for rich Markdown examples. Upload images with `image_upload` and inspect attachments with `image_read`. `file_export` supports Markdown, print-ready HTML, and server-rendered PDF where the account permits it. See [MCP workflows](mcp-workflows.md) for the distinction between content editing and web controls.
