---

name: dotmd-docs

description: Create, edit, organize, summarize, and review Markdown-native DotMD Docs while preserving meaning, structure, links, and collaboration context.

---

# DotMD Docs

## Before editing

1. Confirm the target Doc and audience.
2. Read the relevant section and neighboring context.
3. Determine whether the user wants direct edits, suggestions, or comments.
4. Preserve established terminology, links, and Markdown conventions.

## Drafting

- For a new Doc, use `file_create` with `type: "doc"`, a title, and initial `markdown`. Omit `namespaceId` for Personal.
- Read `dotmd_guide` with `topic: "docs"` for DotMD rich Markdown examples. Docs support Mermaid fences, GFM tables, columns, callouts, footnotes, images, sanitized HTML, and approved embeds.
- Start with a useful title and concise opening.
- Use a logical heading hierarchy.
- Prefer short paragraphs, concrete verbs, and scannable lists.
- Use tables only when comparison is clearer than prose.
- Mark assumptions and unresolved decisions explicitly.
- Do not invent facts, sources, owners, or dates.

To embed a DotMD Art, discover the connected schemas, read it with `art_read`, and use its canonical `embedding.docEmbedUrl`. The owner must have enabled **Allow embedding**; the Doc does not grant access to the Art. Insert the returned canonical URL or iframe through the existing embed flow, or include a sanitized iframe in authorized Markdown edits. Preserve its `/embed/art/` route, accessible title, `sandbox="allow-scripts"`, `referrerpolicy="no-referrer"`, and responsive dimensions. Keep ordinary `/doc/` links as links. Request publishing only when the user explicitly asks for external access; never publish an Art just because its Doc is public.

## Editing

- Read `file_read` before selecting anchors. Use `apply_edits` with one ordered `edits` array for related changes. Anchors match visible plain text within one text leaf, not Markdown markers or a whole section; choose a unique phrase within one block.
- `modify` replaces `before` with `after` as text within that same node. Do not send an entire multi-block Markdown section as one replacement. `add` can insert rich Markdown after the anchored top-level block; verify that its anchor exists first because an unmatched `add` appends at the document end.
- If an anchor fails, reread the passage and choose a unique current anchor. Do not fall back to a whole-body overwrite.
- Use `file_write` with `expectedType: "doc"` only when the user explicitly requests a full replacement.
- Keep each ordinary Markdown list item on one source line. Use a blank line inside a bullet only when a second paragraph is intended; escape pipes inside table cells.
- Upload requested images with `image_upload`, embed its returned durable URL with useful alt text, and inspect existing attachments with `image_read` when needed.
- Make the narrowest coherent change.
- Keep unrelated prose intact.
- Preserve anchors, links, code, embeds, and intentional formatting.
- For a substantial rewrite, present an outline or change summary first.
- Use comments instead of edits when intent is ambiguous.

## Review

Check structure, accuracy, completeness, duplicated ideas, unclear claims, broken references, accessibility, and the requested tone. Separate required corrections from optional style suggestions.

When posting comments is authorized, inspect `comments_list` first. Use `doc_review` for a batch of quoted review notes; check each returned anchor result because missing or ambiguous quotes can produce document-level feedback. Use `comment_reply` for an existing thread rather than creating a duplicate.

## Verify

Read the changed passage in context, check rendered structure when possible, and report the sections changed plus any claims requiring human validation.

Use `file_export` for Markdown, print-ready HTML, or PDF when supported by the account. Open the output before claiming the export is ready; tool success does not prove the layout.
