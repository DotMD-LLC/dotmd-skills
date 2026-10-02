---

name: dotmd

description: Route work across DotMD Docs, Slides, Sheets, Arts, files, namespaces, recovery, and MCP tools while preserving current content and access.

---

# DotMD

Use this skill when a request spans DotMD or when a more specialized DotMD skill does not fit.

## Operating sequence

1. Identify the account, namespace, artifact type, and named item. Omit `namespaceId` for Personal; use `namespaces_list` to discover team namespaces.
2. Use `search_docs` for content discovery. For file enumeration, follow `files_list` pagination with `pagination.nextOffset`; a first page is not the whole workspace.
3. Read `file_get` for metadata. Read Docs, Slides, and Sheets with `file_read`; read Arts with `art_read`.
4. Inspect the connected client's tool schemas. Names may have a client prefix. Use `dotmd_guide` for the relevant supported topic before authoring unfamiliar rich content.
5. Choose the narrowest supported writer, perform the authorized action, then read back the result. A user's explicit instruction supplies authorization; ask again only when the target, audience, or consequential scope is unclear.

## Route specialized work

- Docs drafting or editing: use `dotmd-docs`.
- Presentations: use `dotmd-slides`.
- Tables, formulas, or charts: use `dotmd-sheets`.
- Interactive HTML experiences: use `dotmd-arts`.
- Comments, review, or access: use `dotmd-collaboration`.
- Repository synchronization: use `dotmd-github-sync`.

## Safety rules

- `apply_edits` changes selected Doc or Slide blocks; `sheet_apply_edits` changes Sheet cells; `art_update` accepts an Art package against its current revision. These writers are not interchangeable.
- `file_create` can seed a Doc, Slides deck, or Sheet from Markdown. Arts require `art_generate` and `art_create`.
- `file_write` replaces all Markdown content. Use it only for an explicitly intended full replacement, with the matching `expectedType`; reread before replacing concurrent work.
- Namespaces group people and artifacts. Folders organize artifacts, and folder/general-access grants can affect who may open an item. Inspect access before moving between folders or namespaces; membership alone does not guarantee document access.
- `versions` lists or reads history; it has no restore action. Web restore and reapplying an earlier passage are separate operations.
- `file_delete` moves an unshared file to Trash for 30 days. A shared file can instead leave the owner's list while collaborators retain read-only access for 30 days; public links are removed. The MCP result does not identify that disposition, so inspect the resulting state before promising a recovery path. `trash` restores listed trashed files; purge is permanent. Namespace deletion affects every member's documents, so it is not a file-cleanup shortcut.
- Never expose credentials, private links, or content from unrelated items.
- Never assume that a title uniquely identifies an item; disambiguate safely.
- Do not publish, share, delete, permanently delete, restore, overwrite, or change roles without explicit intent.
- Preserve the existing content type and structure unless conversion is requested.
- Treat imports, exports, and AI output as needing verification.
- Do not claim success until the target is read back or the resulting artifact is verified.
- State when an operation is available only in the web interface. Do not invent MCP tools for UI actions such as template selection, presentation controls, or history restore.

## Completion format

Report the target, actions performed, access or publication state if relevant, verification performed, and any remaining human review.
