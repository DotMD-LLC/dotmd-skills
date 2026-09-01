# DotMD Skills & User Guides

> Write in Markdown. Collaborate in real time. Bring your AI.

[DotMD](https://dotmd.co) is a Markdown-native workspace for documents, presentations, and spreadsheets. People and AI assistants can draft, review, organize, and publish work together while Markdown remains at the center.

This public repository contains:

- practical user guides for DotMD features;
- ready-to-use AI skills for DotMD workflows;
- prompt recipes for common jobs;
- safety conventions for permissions, publishing, and AI-assisted edits.

It contains **documentation only**. The DotMD application source is not part of this repository.

## Start here

1. Create or sign in to your account at [dotmd.co](https://dotmd.co).
2. Read [Getting started](guides/getting-started.md).
3. Choose a workflow from the [feature guide](guides/README.md).
4. Give your AI assistant one of the skills in [`skills/`](skills/README.md).
5. Adapt a recipe from [AI workflow examples](examples/prompt-recipes.md).

## What you can do with DotMD

| Area | Use DotMD to | Guide | AI skill |
| --- | --- | --- | --- |
| Docs | Draft structured Markdown, format content, link ideas, and export work | [Docs](guides/docs.md) | [DotMD Docs](skills/dotmd-docs/SKILL.md) |
| Slides | Turn Markdown into a deck, organize slides, add notes, and present | [Slides](guides/slides.md) | [DotMD Slides](skills/dotmd-slides/SKILL.md) |
| Sheets | Build tables, use formulas, structure datasets, and create charts | [Sheets](guides/sheets.md) | [DotMD Sheets](skills/dotmd-sheets/SKILL.md) |
| Files | Organize documents with folders, favorites, recents, templates, and search | [Files and templates](guides/files-and-templates.md) | [DotMD](skills/dotmd/SKILL.md) |
| Collaboration | Co-edit, comment, mention, review, and manage roles | [Collaboration](guides/collaboration.md) | [DotMD Collaboration](skills/dotmd-collaboration/SKILL.md) |
| Sharing | Invite people, share links, and publish selected work | [Sharing and publishing](guides/sharing-and-publishing.md) | [DotMD](skills/dotmd/SKILL.md) |
| Portability | Import existing files and export work for other tools | [Import and export](guides/import-export.md) | [DotMD](skills/dotmd/SKILL.md) |
| History | Review earlier versions and restore intentionally | [History and recovery](guides/history-and-recovery.md) | [DotMD](skills/dotmd/SKILL.md) |
| GitHub | Keep Markdown folders synchronized with a repository | [GitHub sync](guides/github-sync.md) | [DotMD GitHub Sync](skills/dotmd-github-sync/SKILL.md) |
| AI & MCP | Use built-in AI, your own provider, or a connected AI client | [AI and MCP](guides/ai-and-mcp.md) | [All skills](skills/README.md) |

Feature availability can depend on your plan, role, workspace settings, client, or rollout. The DotMD interface is the source of truth for your account.

## Skills for AI assistants

The skills are plain Markdown instruction packages. They are deliberately client-neutral: use them with an assistant that supports custom skills or include the relevant `SKILL.md` in the assistant's context.

```text
skills/
├── dotmd/                 General routing and safe operating rules
├── dotmd-docs/            Drafting and editing documents
├── dotmd-slides/          Building and reviewing presentations
├── dotmd-sheets/          Working with tabular data and formulas
├── dotmd-collaboration/   Comments, review, mentions, and sharing
└── dotmd-github-sync/     Markdown repository synchronization
```

Every skill follows the same safety model:

1. Inspect the target and current permissions.
2. Confirm ambiguous scope before a consequential action.
3. Preserve the user's structure and meaning.
4. Preview or summarize material edits.
5. Never publish, share, delete, restore, or overwrite implicitly.
6. Report exactly what changed and what still needs human review.

## Example workflows

### Turn meeting notes into a decision record

> In DotMD, find my meeting notes from today. Create a new Doc called “Decision record — API versioning.” Summarize the decision, context, alternatives, owner, and follow-ups. Link back to the notes. Do not publish it.

### Create a presentation from a brief

> Use the DotMD Slides skill. Build an eight-slide launch review from “Launch brief.” Keep one idea per slide, add speaker notes, and include a final risks-and-decisions slide. Show me the outline before writing.

### Clean a project tracker

> Use the DotMD Sheets skill. Inspect “Launch tracker,” standardize the Status column, identify missing owners and dates, and propose formulas for overdue items. Do not change values until I approve the preview.

### Review without rewriting

> Review “Customer onboarding” in DotMD. Add focused comments for unclear claims and missing evidence. Do not directly edit the document or resolve existing threads.

More recipes: [examples/prompt-recipes.md](examples/prompt-recipes.md).

## Human and AI collaboration principles

- **Markdown stays useful.** Prefer clear headings, lists, tables, links, and portable syntax.
- **Review is visible.** Use comments or proposals when intent is uncertain.
- **Access stays narrow.** A connected assistant operates only with the access granted to it.
- **Publishing is deliberate.** Private, shared, link-accessible, and published are different states.
- **Recovery comes first.** Read current content and history before overwriting or restoring.
- **No invented success.** If an action cannot be verified, say so.

## Documentation map

- [All user guides](guides/README.md)
- [All AI skills](skills/README.md)
- [Prompt recipes](examples/prompt-recipes.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## Contributing

Corrections and public-safe workflow examples are welcome. Do not submit DotMD application code, internal documentation, secrets, customer information, or private screenshots. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Released under the [MIT License](LICENSE). DotMD and its logos are trademarks of DotMD LLC; the license does not grant trademark rights.
