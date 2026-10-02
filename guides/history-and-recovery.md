# Version history and recovery

Use Version history to inspect earlier content and Trash to recover a deleted item. They solve different problems.

## Compare saved versions

Open the item's **History** tab or **Version history** panel where available. Docs, Slides, Sheets, and Arts support saved-version comparisons. Review the version number, label, author, and time, then compare the snapshot with the current content in **Rendered** or **Source** mode.

Both comparisons are read-only. **Save version** captures a manual snapshot when you have edit access; it is useful before a large change. History availability and retention can depend on the item and plan.

## Restore content

Read the current content before restoring, and preserve recent work you still need. If you only need a short passage, copy it from the old state and make a focused edit.

For a full replacement, choose **Restore version** and confirm the web dialog. This restores the whole saved state, rather than applying individual Source changes. Check the result and any relevant formulas, media, comments, or published view afterwards. Read-only users can inspect history but cannot save or restore versions.

## Recover a deletion

Deleting an unshared item moves it to **Trash** for 30 days. Open Trash, find the item, and choose **Restore** while it remains recoverable. The web view also shows deleted folders and namespaces; restoring either can bring back multiple items, so review its confirmation.

Deleting an item with direct collaborators can instead freeze it as **dormant**: it leaves the owner's active list, while collaborators retain read access for up to 30 days. Public link access and publication are revoked. Dormant items are absent from Trash and cannot be restored with its controls. Check the item's actual state before promising Trash recovery or assuming all collaborator access ended immediately.

An item past its recovery window cannot be restored. Permanent deletion also cannot be undone. Restoring a namespace leaves independently deleted documents in their owners' Trash and does not reactivate its revoked invite links.

## Recovery through MCP

| Need | Supported workflow |
| --- | --- |
| Find saved versions | `versions` with `action: "list"`, `docId`, optional `limit` (maximum 100), and the returned `cursor` for more. This returns metadata without content. |
| Read one saved state | `versions` with `action: "get"`, `docId`, and `versionId`; read the current item separately to compare. |
| Restore a saved version | Use the web editor. The MCP `versions` tool has only `list` and `get`. |
| Find documents in Trash or deleted namespaces | `trash` with `action: "list"`; it returns recovery time in `daysLeft`. Dormant documents are excluded. |
| Restore one trashed document | `trash` with `action: "restore"` and `docId`. |
| Restore a deleted namespace | `namespace_restore` with `namespaceId`; namespace owner access is required. |
| Permanently remove a trashed document | `trash` with `action: "purge"` and `docId`, only when permanent removal is explicitly requested. |

`file_delete` returns success without saying whether the item became trashed or dormant. Verify the Trash list before claiming it can be restored there. MCP edits can create a **Before MCP edit** snapshot; that is the previous state, so read the current item for the latest result. Do not interpret it as an after-edit snapshot or as a completed restore.

Tell an assistant which item and version to recover. It should explain what a whole-version restore would replace and follow authorization already given. Inspecting a version alone does not authorize replacing current work.

See the [DotMD Collaboration skill](../skills/dotmd-collaboration/SKILL.md) for collaboration and recovery tool boundaries.
