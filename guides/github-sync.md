# GitHub two-way sync

GitHub sync connects a DotMD folder with Markdown files in a repository path.

## Connect

1. Open the GitHub settings in DotMD.
2. Connect or install the DotMD GitHub integration.
3. Grant access only to the repositories you intend to use.
4. Return to DotMD and choose a folder to link.
5. Select the repository, branch, and optional path prefix.
6. Review the initial import before continuing.

## Synchronize

Sync reconciles DotMD documents and repository Markdown. Review the status after each meaningful batch. Non-overlapping changes can be combined; overlapping edits can require conflict resolution.

## Protected branches

When branch rules prevent direct writes, DotMD can stage outbound changes for review through a pull request flow. Review the change set before creating the pull request. DotMD should not bypass or weaken repository protection.

## Resolve conflicts

1. Read both sides and the common context.
2. Decide the intended final meaning.
3. Resolve the text without discarding unrelated edits.
4. Sync again.
5. Verify that DotMD and GitHub show the intended result.

## Safety

- Start with a dedicated folder or narrow path.
- Avoid linking generated, binary, or secret-bearing content.
- Never place API keys or credentials in Markdown.
- Confirm repository, branch, and path before unlinking or re-linking.

Use the [DotMD GitHub Sync skill](../skills/dotmd-github-sync/SKILL.md).
