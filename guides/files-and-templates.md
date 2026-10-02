# Files, folders, search, and templates

## Organize work

Docs, Slides, Sheets, and Arts appear as files in the workspace. Choose their type by the result you need; an Art holds an interactive HTML package rather than Markdown.

- Use folders for durable projects or subjects, not every short-lived task.
- Use clear titles that remain understandable in search results.
- Favorite the small set of items you open repeatedly.
- Use Recents for continuity and Shared with me for incoming collaboration.
- Move or rename items carefully because collaborators may rely on their location or title.

## Search and command palette

Use the main search surface to find documents by title or available content metadata. Open the command palette with `Ctrl+K` or `Cmd+K` for fast navigation and actions. Narrow a query with meaningful project, customer, or artifact words.

## Templates

The template gallery provides starting structures for Docs, Slides, and Sheets. Create an Art from **New → Art**, then describe and review the visual in its canvas.

1. Open the template gallery.
2. Preview a suitable template.
3. Create a new item from it.
4. Replace instructional placeholders.
5. Review sharing and ownership before inviting people.

Templates are starting points, not live links to the original. Customize the copy for the current audience.

## Arts and connected assistants

Use `art_read` to obtain an Art's package and revision ID, then `art_update` to change it. General Markdown writers `file_write` and `apply_edits` refuse Art updates. An assistant should read the current Art and use its revision ID when replacing the package. See [Arts](arts.md).

## Delete and recover

Before deleting, identify the exact item and whether collaborators still need it. Use the Trash or recovery surface when available. Permanent deletion requires an explicit instruction for that item.
