# DotMD Skills — Live Collaboration for People and AI

> Humans and AI editing together, live—without giving up Markdown.

[DotMD](https://dotmd.co) is a live, Markdown-native collaboration workspace for Docs, Slides, and Sheets. Teammates can edit, comment, review, and see one another's presence in real time. Connect an AI through MCP and it can join the same workflow: find the right artifact, draft or revise content, respond to a review, update a tracker, or prepare a deck—within the access you grant.

## AI is a collaborator, not a copy-and-paste box

Most AI writing flows happen outside the document: copy content into a chat, lose its context, paste a result back, and hope nobody edited the original meanwhile. DotMD keeps the work where the team already is.

- **Shared live context:** people and connected AI work against the current DotMD artifact.
- **Visible teamwork:** collaborators can see active presence and review changes in the shared workspace.
- **Docs, Slides, and Sheets:** one collaboration model across prose, presentations, and structured data.
- **Comments and mentions:** ask for review, discuss uncertainty, and keep decisions beside the work.
- **Permission-aware:** the AI operates only through the account and access explicitly connected to it.
- **Review before consequence:** skills require confirmation before publishing, sharing, restoring, deleting, or broad overwrites.
- **Markdown remains yours:** use portable content and GitHub sync rather than trapping knowledge in an AI chat.

### Picture the workflow

1. A teammate drafts a product brief in a DotMD Doc.
2. An AI collaborator turns the approved outline into Slides and updates the launch Sheet.
3. Reviewers comment in real time while the writer and AI address separate sections.
4. The team verifies the result, resolves threads, and deliberately shares or publishes the final work.

No stale attachment. No mystery rewrite. One live workspace with human judgment at the center.

This public repository contains:

- practical user guides for DotMD features;
- ready-to-use AI skills for DotMD workflows;
- prompt recipes for common jobs;
- safety conventions for permissions, publishing, and AI-assisted edits.

It contains **documentation only**. The DotMD application source is not part of this repository.

## Start here

1. Install all six DotMD skills for your AI platform:

   ```bash
   npx github:DotMD-LLC/dotmd-skills install --platform codex
   ```

2. Replace `codex` with `claude`, `cursor`, `copilot`, or `gemini` as needed.
3. Create or sign in to your account at [dotmd.co](https://dotmd.co).
4. Connect the AI client through **Settings → Apps & MCP** in DotMD.
5. Try a workflow from [AI workflow examples](examples/prompt-recipes.md).

For user-wide installs, add `--global`. For every supported platform in the current project, use `--platform all`. See the [five-platform setup guide](guides/install-ai-platforms.md).

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

The skills follow the open Agent Skills format and install with `npx`:

```bash
# Current project; all DotMD skills
npx github:DotMD-LLC/dotmd-skills install --platform claude

# Current user; one focused skill
npx github:DotMD-LLC/dotmd-skills install --platform cursor --global --skill dotmd-collaboration

# Preview without writing
npx github:DotMD-LLC/dotmd-skills install --platform all --dry-run

# Verify an installation
npx github:DotMD-LLC/dotmd-skills doctor --platform codex
```

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
- [Install on five AI platforms](guides/install-ai-platforms.md)
- [Prompt recipes](examples/prompt-recipes.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## Contributing

Corrections and public-safe workflow examples are welcome. Do not submit DotMD application code, internal documentation, secrets, customer information, or private screenshots. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Released under the [MIT License](LICENSE). DotMD and its logos are trademarks of DotMD LLC; the license does not grant trademark rights.
