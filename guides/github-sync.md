# GitHub two-way sync

GitHub sync connects Markdown files in a repository with a DotMD folder. It is a Premium feature. A team namespace's GitHub connection is managed by its Admins.

## Connect and import in the web app

1. Open **Settings → GitHub** for Personal, or the team's GitHub settings.
2. Select **Install the DotMD GitHub App** and choose the repositories it may access on GitHub.
3. Return to DotMD and select a repository under **Import a repository**.
4. Review its Markdown file count and preview. In **Advanced**, choose the branch and whether to include subdirectories.
5. Select **Import repository** or **Import N files**. Confirm a large import if prompted and wait for it to finish.

DotMD creates a top-level folder named after the repository. Subdirectories become matching folders when included, which is the web default. You can rename the DotMD folder afterwards. **Manage repositories** changes which repositories the GitHub App can access.

A preview marked **At least N files** is incomplete. Check that the import covers what you need; absence from that preview does not prove a file is missing from GitHub.

## Sync and inspect the result

Edits can travel in both directions. A sync imports new Markdown files, pulls upstream changes, combines compatible edits, and pushes local changes. Use a linked folder's sync controls, check the result and **Sync runs**, then open a representative document and its repository file.

Overlapping changes may become conflicts. A completed run can also have changes waiting for review, so check the status before assuming everything reached the repository branch.

## Protected branches

When direct writes need review, open **Review required → Review changes**. Inspect additions, updates, removals, and blocked items before choosing **Create pull request**. Once opened, follow **Open in GitHub** to review it. Creating a pull request does not approve or merge it, and repository rules still apply.

## Resolve conflicts

Open a conflict in GitHub settings and compare the DotMD and GitHub versions. Keep useful changes from both sides before saving a resolution. Use **Keep mine** or **Take theirs** for all conflicts only when you intend the same choice for every file. Run sync again, inspect remaining conflicts, and verify the final content.

## Unlink or disconnect

**Unlink** stops one folder's sync and keeps its documents and repository files. The web **Disconnect** removes the GitHub connection and unlinks the namespace's linked folders after confirmation; it also keeps the content.

## Work through MCP

MCP can discover repositories and branches, link an existing folder, list links, run sync, and unlink. Linking runs an initial two-way sync, so documents already in that folder may push to GitHub as repository Markdown imports.

MCP also has a PAT connection path. Its `github_status` checks that stored token; it does not report whether the GitHub App is installed. A false token status alone is not a reason to reconnect a working App connection. MCP `github_disconnect` removes only the PAT and leaves links and an App installation in place.

MCP root links default to top-level Markdown only; set `recursive: true` to include directories. MCP additionally accepts a repository `pathPrefix`. The web import uses the repository root and includes subdirectories by default. Detailed change reviews, pull-request creation, and conflict resolution use the web controls.

Use the [DotMD GitHub Sync skill](../skills/dotmd-github-sync/SKILL.md). Keep credentials and private links out of synchronized content.
