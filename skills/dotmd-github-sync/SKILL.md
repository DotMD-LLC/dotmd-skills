---

name: dotmd-github-sync

description: Connect and synchronize DotMD Markdown folders with GitHub repositories, review status, handle protected branches, and resolve conflicts safely.

---

# DotMD GitHub Sync

## Before linking

Confirm the DotMD folder, repository owner/name, branch, path prefix, and whether existing files should import. Inspect both sides for naming collisions, sensitive material, generated files, and unrelated content.

## Synchronize

1. Read the current link and status.
2. Summarize pending inbound, outbound, and conflicting changes.
3. Sync only the authorized link.
4. Read status again.
5. Verify representative content on both sides.

## Protected branches

Do not bypass branch protection. Review the pending batch and use the supported pull-request path. Never merge, approve, or weaken rules unless separately and explicitly authorized.

## Conflicts

Read both variants and their common context. Preserve independent changes, ask when meaning is ambiguous, write the intended resolution, sync again, and verify both sides.

## Hard confirmations

Require explicit approval before linking, unlinking, changing repository/branch/path, overwriting conflicts, creating a pull request, or any destructive cleanup.

## Security

Never sync credentials, private keys, tokens, private share links, or environment files. Do not display connection secrets. Report repository, branch, path, result, and unresolved conflicts without exposing sensitive content.