---
name: dotmd-collaboration
description: Review DotMD Docs, Slides, Sheets, and Arts through comments, mentions, and shared access; manage people or public access only within the user's requested scope.
---

# DotMD Collaboration

## Choose the interaction

Read the relevant item and existing threads before acting. Edit when the user wants a content change; comment when they want discussion. Reply in the existing thread when answering its question. Resolve or reopen a thread when instructed, or when completing a review explicitly includes that judgment. Do not rewrite or delete another author's feedback.

Discover the connected tools and their current schemas first. Availability depends on the connection's scope and the caller's item access. Read-only access permits inspection; commenter or editor access is needed for comment mutations, and content edits require editor access.

## Comments and reviews

| Tool | Use and key arguments |
| --- | --- |
| `comments_list` | Read threads with `docId`; paginate with `offset` and `limit` (maximum 100). |
| `comment_add` | Add a thread with `docId`, `body`, and optional `quote`. |
| `comment_reply` | Answer in a thread with `docId`, `threadId`, and `body`. |
| `comment_resolve` | Set `resolved: true` to resolve, or `false` to reopen; pass `docId` and `threadId`. |
| `doc_review` | Submit one review with `docId`, `summary`, and nonempty `comments: [{quote, body}]`. |
| `comment_react` | React with `docId`, `threadId`, `emoji`, and optional `commentId`; omit `commentId` for the first comment. `on: false` removes the reaction. |
| `comment_edit` / `comment_delete` | Change or retract an agent-authored comment using its returned `commentId`; never guess an ID or modify human comments. |
| `art_comment_add` | Pin a note using `docId`, current `revisionId`, `artId`, `x`/`y` in `[0, 1]` relative to the selected component's bounds, and `body`. `(0.5, 0.5)` targets its center. Read the Art first. |

For an inline text comment, copy an exact, unique quote from one paragraph. Inspect the returned anchor result: a missing or ambiguous quote posts a document-level note, so do not claim it highlights a sentence. Use `doc_review` for a batch review; it gives one review notification and reports which notes anchored. The document has a limit of 50 unresolved agent comments, including review summaries. Prioritize useful notes if a batch exceeds it.

An unexpectedly empty `comments_list` can mean the live item was briefly unreachable. Retry the read before assuming previous feedback is gone or posting a duplicate review.

Use the current response to obtain thread and comment IDs. If the deployed response omits an ID required for editing or deleting a comment, explain the limitation and use the web comment controls; do not fabricate an identifier. Deleting the last comment removes its thread, and deletion cannot be undone.

## Mentions to an agent

`mentions_pending` claims requests for the connected agent and returns each request's `id`, `claimToken`, prompt, target, and available context. It accepts `waitSeconds` up to 25. Choose the action by intent:

- A request to change text: use `apply_edits` at the returned target. For a document-body mention, use `op: "replace_mention"` with `target.mentionId` and replacement `text`; it removes the mention chip and its trailing instruction text. Use `modify` for a focused change elsewhere.
- A question in a comment: use `comment_reply` in `target.threadId`.
- A suggestion requiring discussion: leave a focused comment.

Context follows the owner's agent-sharing settings and can be absent or truncated. Read the current item or thread when needed and permitted. After completing the requested work, call `mention_complete` with `id` and `claimToken` (optional `resultRef`). If it cannot be completed, call `mention_fail` with those fields and a useful `reason`. Marking a mention complete does not itself edit the item or answer its thread.

## People and access

Use the existing user instruction as authorization for its named item, person, role, and action. Ask only when those details are missing or the next action would widen the agreed scope. Creating a public audience or sending a link to others needs the user's instruction for that action; a request to review content alone does not supply it.

| Tool | Access workflow |
| --- | --- |
| `file_collaborators` | Read direct grants on `docId` when the caller can edit. It does not enumerate inherited folder/General access or link/public audiences; an empty result does not prove owner-only access. |
| `file_share` | Grant or update a person's access with `docId`, `email`, and `role`: `viewer`, `commenter`, or `editor` (default `viewer`). |
| `file_unshare` | Revoke a direct grant with `docId` and the returned `subjectId`. |
| `files_shared_with_me` | Find items directly shared with the caller and their roles. |
| `namespace_members` | `list`, `add`, `set_role`, or `remove`; pass `namespaceId`, and for mutations the member's email in `userId` plus `role` for add/set_role. Mutations require namespace Admin. |
| `file_link_share` | Set `enable` and a link `role` on a Personal item; only the owner can enable it. Disabling it revokes link access without removing direct grants or publication. |

A namespace groups people; a folder organizes items and can carry inherited access. Namespace membership is necessary for team content but does not open every restricted item. General access, folder inheritance, and direct grants determine item access, capped by the person's namespace role. Namespace Admin is a membership role, not automatic access to every item. Removing membership does not transfer that person's documents.

A team item's direct grantee must already belong to its namespace, and the granted role cannot exceed that membership role. If a single-item share is refused for a nonmember, explain the boundary; do not add namespace membership without authorization for that wider change.

In the web Share dialog, read **People with access** and each access source. Team items offer **Restricted**, **Everyone in the namespace**, and, where applicable, **Everyone in this folder**. Removing a direct grant may leave inherited access. The MCP has no folder-sharing or General access mutation tool; use the web controls when that is the requested change. **Private** remains owner-only; do not replace it with a broader access model.

Personal **Anyone with the link** and publishing are independent. A Viewer link allows reading without signing in; commenting or editing requires sign-in. Team items do not use public link sharing. Personal Docs offer **Publish as blog**; Personal Slides, Sheets, and Arts offer **Publish to web** where available. MCP exposes `art_publish(docId)` for an owner-held Personal Art; it has no general publish/unpublish tool for all item types. Use the web controls for the other supported publishing actions.

## Verify and recover

Read the result and current state after a mutation. Report the item, action, role/access source, and unresolved limitations. Verify a public URL signed out when possible; a returned URL alone does not prove the page renders.

Use `versions` with `action: "list"` or `"get"` to inspect saved states. It cannot restore a version; use web Version history for whole-version restore. For a trashed item, use `trash` (`list` or `restore`) instead. Permanent `purge` needs an explicit request for permanent removal.

`file_delete` sends unshared items to Trash for 30 days, but items with direct collaborators can become dormant/read-only for up to 30 days instead, preserving collaborator reads while public links and publication are revoked. Dormant items are absent from Trash and have no Trash restore path. The MCP delete response is only `ok`; verify the Trash list before promising recovery there.

See the public [Collaboration](https://github.com/DotMD-LLC/dotmd-skills/blob/main/guides/collaboration.md), [Sharing and publishing](https://github.com/DotMD-LLC/dotmd-skills/blob/main/guides/sharing-and-publishing.md), and [History and recovery](https://github.com/DotMD-LLC/dotmd-skills/blob/main/guides/history-and-recovery.md) guides for the corresponding web workflows.
