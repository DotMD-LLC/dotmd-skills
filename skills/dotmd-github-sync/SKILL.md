---
name: dotmd-github-sync
description: Import and synchronize DotMD Markdown folders with GitHub, inspect links and sync results, and route protected-branch reviews or conflicts to the supported web controls.
---

# DotMD GitHub Sync

## Establish the scope

Identify the Personal or team namespace, folder, repository owner/name, branch, and repository path. Honor authorization already supplied by the user. Ask only for a missing consequential choice or a change beyond the agreed scope. GitHub sync is a Premium feature; team operations require namespace Admin and the folder must belong to that namespace.

Linking performs an initial **two-way** sync: repository `.md` files import, and existing DotMD documents in the selected folder can push to GitHub. Review existing content and collisions before linking. Do not sync credentials, keys, environment files, or sensitive links, and do not display connection secrets.

## Web and MCP connection differences

The web **Settings → GitHub** flow installs the **DotMD GitHub App**. The user chooses repository access on GitHub and can change it with **Manage repositories**. The web import creates a top-level folder named after the repository and mirrors its directories. **Advanced** selects a branch and whether to include subdirectories; the web defaults to including them and does not expose a path-prefix field.

MCP still exposes `github_connect` for a PAT and `github_status` for stored PAT status. `github_status` returning `configured: false` does not prove a GitHub App installation is absent. Repository discovery and sync can use an existing App connection. MCP cannot perform the interactive GitHub App installation; route that step to the web flow. Use PAT tools only when the user explicitly chooses that connection method, with minimum repository access; never ask them to paste a token into a public artifact.

## MCP operations

Discover current schemas before calling tools. Omit `namespaceId` for Personal; include it consistently for a team namespace.

| Tool | Key arguments and result |
| --- | --- |
| `github_status` | Optional `namespaceId`; reports PAT `configured` and optional `last4`, never the token. |
| `github_connect` | `token`, optional `namespaceId`; creates or rotates the stored PAT. |
| `github_repos` | Optional `namespaceId`; lists reachable repository owner/name/default branch. |
| `github_branches` | `owner`, `repo`, optional `namespaceId`; lists reachable branches. |
| `github_links` | Optional `namespaceId`; lists folder targets with `fileCount` and conflict counts. It does not provide a detailed pending-change review. |
| `github_link_folder` | `folderId`, `owner`, `repo`, `branch`; optional `pathPrefix`, `recursive`, `confirm`, `namespaceId`. Links and immediately syncs. |
| `github_sync` | `folderId`, optional `namespaceId`; imports, pulls, merges, and pushes now. |
| `github_unlink` | `folderId`, optional `namespaceId`; removes sync links and keeps documents and repository files. |
| `github_disconnect` | Optional `namespaceId`; removes the stored PAT. Links and a separately installed GitHub App remain. |

For MCP, a repository-root link defaults to top-level `.md` files only; set `recursive: true` to include directories. A sub-path link defaults to recursive. State the intended behavior explicitly because the web default differs. An existing link cannot be pointed at a different repository, branch, or path without unlinking first.

If `github_link_folder` returns `needsConfirmation: true`, it has not completed the large import. Report the count and use `confirm: true` only when the user's authorization covers that size. If `truncated: true`, counts and sample paths are incomplete; never treat unlisted files as absent. Prefer a scope that can be listed fully. Do not accept an incomplete import silently.

Successful link/sync returns `imported`, `pulled`, `merged`, `conflicts`, and `pushed`. Inspect the tally, reread `github_links`, and verify representative content. A persisted link with a failed initial import is a partial outcome: correct the connection/reference, then retry `github_sync`, or unlink when requested. Zero counts or `ok: true` alone do not prove both sides are current.

## Protected branches and conflicts

The web UI supports **Review required**, **Review changes**, **Create pull request**, and links to an opened pull request. Inspect the change batch and blockers there. MCP has no tool for detailed review batches, pull-request creation, or GitHub conflict resolution. Do not invent one, bypass branch protection, or claim an MCP sync created or merged a pull request.

Open conflicts in the web GitHub settings and compare the variants before choosing a resolution. Preserve independent changes and ask when the intended meaning is unclear. Bulk **Keep mine** or **Take theirs** applies one choice to every conflict; use it only when that blanket choice is authorized. Sync again and verify the intended content and remaining conflicts. PR creation, approval, and merge are separate actions; follow the user's authorization for each.

The web **Disconnect** removes the connection and unlinks the namespace's folders after its confirmation; MCP `github_disconnect` only removes the PAT. Report the actual action and its effect. See the public [GitHub sync guide](https://github.com/DotMD-LLC/dotmd-skills/blob/main/guides/github-sync.md) for the web workflow.
