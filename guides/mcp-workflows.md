# DotMD MCP workflows

The DotMD MCP endpoint connects an assistant to the same artifacts people use in the web workspace. A web control and an MCP tool are separate interfaces: use the tools advertised by the connected client and verify the result in the appropriate artifact.

## Choose the right tool

Names below omit client-specific prefixes. Read the live input schema before calling a tool; it defines available actions, roles, ranges, and account restrictions.

| Task | Supported workflow | Important boundary |
| --- | --- | --- |
| Discover a workspace | `namespaces_list`, `namespace_get` | Omit `namespaceId` for Personal; team membership does not bypass document access. |
| Find or enumerate content | `search_docs`, `files_list`, `files_shared_with_me` | Follow pagination; use content search instead of repeatedly listing every file. |
| Read an artifact | `file_get` for metadata; `file_read` for Docs, Slides, Sheets; `art_read` for Arts | An Art is a governed HTML package rather than Markdown. |
| Create content | `file_create`, `slides_create`, `sheets_create`; `art_generate` then `art_create` | Arts require a validated caller-authored package. |
| Edit a Doc or deck | `file_read` then `apply_edits` | Exact current anchors preserve unrelated live edits. |
| Edit Sheet cells | `sheet_apply_edits` | Use A1 cell references and the correct worksheet ID. |
| Configure Sheet headers | `sheet_configure` | Set `firstRowIsHeader` deliberately. |
| Manage a native chart | `sheet_chart` with `list`, `create`, `update`, or `delete` | Charts remain bound to cell ranges; list to obtain `chartId`. |
| Update an Art | `art_read`, `art_generate`, `art_update` | Pass the current `revisionId`; a stale revision requires a fresh read. |
| Add or inspect images | `image_upload`, `image_read` | Use the returned asset identifiers and durable URLs. |
| Review or discuss | `comments_list`, `doc_review`, `comment_add`, `comment_reply`, `comment_resolve` | Inspect existing discussion and verify quote anchoring. Art component feedback uses `art_comment_add`. |
| Handle mentions and activity | `mentions_pending`, `mention_complete`, `mention_fail`, `notifications_list`, `notifications_update`, `updates` | Complete work before acknowledging it. Notifications are directed; updates are ambient activity. |
| Share intentionally | `file_collaborators`, `file_share`, `file_unshare`, `file_link_share`, `namespace_members` | Share one file when that is the request; do not add namespace membership to achieve it. |
| Organize and recover | Folder/file management, `file_delete`, `trash`, `versions` | `versions` reads history; it has no restore action. Trash purge is permanent. |
| Export supported content | `file_export` | Markdown, print-ready HTML, or PDF; verify the output and account availability. |
| Synchronize Markdown | GitHub status, connection, folder-link, and sync tools | Check exact capabilities and protected-branch status; never invent a PR or merge tool. |
| Read public articles | `blog_list`, `blog_read` | Public, read-only content; a published file is not automatically a blog entry. |

## Focused writes

Read current content before editing. Related Doc or Slide edits go into one ordered `apply_edits` batch. Its anchors match visible plain text in one text leaf, without Markdown markers. `modify` replaces text within that node; `add` parses rich Markdown after the anchored top-level block, or appends at the end if its anchor is missing. Verify anchors before adding content, and check placement and slide boundaries afterwards. Sheet cell edits use `sheet_apply_edits`. Arts use package validation and revision checks. `file_write` replaces all Markdown content and should carry the matching `expectedType` only when a full replacement is intended.

If a scoped anchor or Art revision no longer matches, read again and account for the intervening changes. Do not bypass that refusal by replacing the entire artifact.

## Web and MCP differences

- **Docs:** rich Markdown and comments have MCP tools; visual editing, preview, and toolbar controls live in the web editor.
- **Slides:** MCP writes Markdown decks and notes; Present mode and audience controls are web interactions.
- **Sheets:** cell edits, header configuration, and native charts have focused tools. Sorting, filtering, formatting, tab management, and structural changes should use the web interface when the connected MCP catalog lacks an appropriate operation.
- **Arts:** the web AI surface generates a reviewable proposal. MCP `art_generate` validates and canonicalizes a package that the assistant has already authored; it does not call a model. Updating requires the current revision. Reattaching comments from an earlier revision is an explicit web review action.
- **History:** the web interface can restore a selected version. MCP `versions` lists or reads previous content; an authorized recovery must reapply the intended content through a supported writer.
- **Publishing:** use the web Publish flow for Docs, Slides, and Sheets. `art_publish` publishes an Art only for its owner in Personal. Link sharing is separate from publishing.

## Verify completion

Read back the changed content, cells, Art revision, roles, or status. Check any generated file in a viewer. Report exactly which action succeeded, the resulting access state when relevant, and anything that still requires a web review. A configured endpoint, a successful tool call, and a verified artifact are separate results.

For setup and upgrades, see [Install on five AI platforms](install-ai-platforms.md). For detailed authoring, use the [DotMD skills](../skills/README.md).
