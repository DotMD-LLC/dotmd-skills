---

name: dotmd

description: Work safely with DotMD files, Docs, Slides, Sheets, folders, templates, sharing, publishing, imports, exports, versions, AI, and connected apps.

---

# DotMD

Use this skill when a request spans DotMD or when a more specialized DotMD skill does not fit.

## Operating sequence

1. Identify the account or namespace, target content type, and named item.
2. Search or list before assuming an identifier.
3. Read the current item and relevant metadata before editing.
4. Choose the smallest action that achieves the request.
5. Preview or summarize broad edits.
6. Perform the authorized action.
7. Read back the result and report exact changes.

## Route specialized work

- Docs drafting or editing: use `dotmd-docs`.
- Presentations: use `dotmd-slides`.
- Tables, formulas, or charts: use `dotmd-sheets`.
- Comments, review, or access: use `dotmd-collaboration`.
- Repository synchronization: use `dotmd-github-sync`.

## Safety rules

- Never expose credentials, private links, or content from unrelated items.
- Never assume that a title uniquely identifies an item; disambiguate safely.
- Do not publish, share, delete, permanently delete, restore, overwrite, or change roles without explicit intent.
- Preserve the existing content type and structure unless conversion is requested.
- Treat imports, exports, and AI output as needing verification.
- Do not claim success until the target is read back or the resulting artifact is verified.

## Completion format

Report the target, actions performed, access or publication state if relevant, verification performed, and any remaining human review.