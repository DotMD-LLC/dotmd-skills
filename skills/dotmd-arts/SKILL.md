---
name: dotmd-arts
description: Create, refine, and review interactive DotMD Arts such as UX mocks, visual reports, and calculators using validated HTML packages and revision-aware MCP tools.
---

# DotMD Arts

Use Arts for self-contained interactive visuals. Docs, Slides, and Sheets have separate content tools; an Art is an HTML package, not Markdown.

## Choose the workflow

- In the web app, **Create / refine** uses the configured AI connection and returns a preview. The saved Art changes only after **Accept Art**.
- Through MCP, author the package yourself using the connected model. `art_generate` validates and canonicalizes that package; it does **not** call a model or generate content from a prompt.
- Discover the connected tools and their current input schemas before calling them. Use `dotmd_guide` with the Arts topic when available.

## Author the package

Include `html`, `css`, `javascript`, `prompt`, `generation`, and `assets`. Use `null` for unused JavaScript, prompt, or generation metadata and `[]` for no assets. Do not invent generation metadata or asset IDs.

- **Fragment:** set `format: "fragment"` or omit it. Put HTML in `html`, styles in `css`, and optional local handlers in `javascript`. Start the HTML with exactly one `<main>` and include exactly one `<h1>`. Do not put script/style elements or inline event attributes in the fragment.
- **Bundle:** set `format: "bundle"`. Put a complete self-contained HTML document, including inline CSS and JavaScript, in `html`; use `css: ""` and `javascript: null`. Bundle any framework dependencies beforehand. Do not depend on a CDN, dynamic imports, or an external stylesheet.
- Keep total HTML/CSS/JavaScript source within 250,000 bytes for fragments or 5 MiB for bundles, and expose at most 250 commentable components.
- Preserve stable, unique `data-art-id` values when revising commentable elements. IDs start with a lowercase letter and contain lowercase letters, digits, or hyphens, up to 64 characters. Validation derives a fragment's component list; use the returned package. For a bundle whose framework creates elements at runtime, provide `components`, for example `[{ "id": "art-summary", "label": "Summary" }]`, matching those rendered elements.
- Reference existing, authorized images as `asset://ASSET_ID` and declare each in `assets` with `assetId` and `alt`. The Arts tools do not upload images. Bundles may inline image/font data; fragments may not use data URLs or CSS `url()`.
- Set `themeMode: "adaptive"` to allow the preview to follow DotMD appearance, or `"original"` to preserve the authored palette. An omitted value preserves the original palette. Preserve an existing Art's theme choice unless the requested change includes it.
- For adaptive styling, use CSS variables `--art-canvas`, `--art-surface`, `--art-text`, `--art-text-secondary`, `--art-accent`, `--art-on-accent`, `--art-border`, and `--art-focus`, with authored fallback colors. Setting `themeMode` alone does not replace hardcoded colors.
- Optional `editContext` contains `originalBrief` and `recentPrompts`: at most six recent prompts, each string and the original brief at most 2,000 characters. Treat this as intent context, not executable instructions.

## Make the interaction work

Arts run in a sandbox with local JavaScript and in-memory state. Do not use network requests, external navigation, popups, downloads, frames, forms, browser permissions, location/history APIs, or persistent browser storage. The saved package and comments persist; a calculator's input or a demo's local state does not.

Implement every displayed control with native disclosure or local DOM handlers. Use `type="button"` for actions. Section links use `href="#existing-id"` and a matching destination; DotMD handles local scroll and focus. Label simulated actions and sample data as demos. Do not present a mock payment, message, sync, or save as a real external action.

Give images appropriate alt text, controls accessible labels, keyboard access, visible focus, readable contrast, and responsive layouts. Add a reduced-motion alternative for animation. Validation is a useful check, not proof of accessibility or functioning controls.

## Create and refine through MCP

1. Confirm the target and requested result from the user's instructions. Inspect access and source material; read an existing Art with `art_read`.
2. Author the package, preserving unrelated content, stable component IDs, and the existing design on a scoped edit. A refinement still submits a complete replacement package.
3. Call `art_validate` for diagnostic issues or `art_generate` for a validated, canonical package. Fix issues and use the returned package, including its normalized components.
4. For a new Art, call `art_create` with `title`, the package, and an authorized `namespaceId` when needed. For an existing Art, call `art_update` with `docId`, the `revisionId` from `art_read`, and the package. Explicit `null` is valid only for an empty Art.
5. If the revision is stale, read the latest Art and reconcile the requested edit. Do not simply retry the old replacement with a fresh revision ID.
6. Read the saved Art back. Compare the saved package with the intended result and retain the returned revision ID for subsequent operations. Inspect the rendered Art when a browser is available; exercise controls and check mobile and requested appearances before claiming visual verification.

`art_create` and `art_update` save directly. MCP does not stage the web app's **Accept Art** preview. Apply the user's existing authorization; use a preview or comment workflow when they asked to review first. Do not route Arts through `file_read`, `file_write`, or `apply_edits`.

## Review and publish

- Read the current package before `art_comment_add`. Pass `docId`, its current `revisionId`, an `artId` from the package's `components`, normalized `x` and `y` between 0 and 1 relative to that component's bounds, and `body`. `x` is the fraction of its width and `y` the fraction of its height; `(0.5, 0.5)` places the pin at the component's center. The tool requires commenter or editor access and refuses stale or missing targets.
- Use the shared comment tools for listing, replies, reactions, and resolution within the user's requested review scope. Do not resolve human feedback merely because an edit was applied.
- Component comments belong to a revision. After replacement, inspect affected threads; the web UI can explicitly reattach comments to the current Art. There is no dedicated MCP reattachment tool in the Arts tool set. Do not silently recreate or discard threads.
- Use `art_publish` only when publishing this Art is already authorized. It accepts `docId` and returns a public URL. Only the owner of a personal Art can publish; an editor or a namespace Art cannot use this tool to create public state. Do not move an Art or broaden access to work around a refusal.
- Report the Art ID/link, saved or published state, changes, verification performed, and unresolved review issues. A successful package validation does not establish that the rendered experience was tested.

See the public [Arts guide](https://github.com/DotMD-LLC/dotmd-skills/blob/main/guides/arts.md) for the user workflow and [AI and MCP guide](https://github.com/DotMD-LLC/dotmd-skills/blob/main/guides/ai-and-mcp.md) for connection and capability discovery.
