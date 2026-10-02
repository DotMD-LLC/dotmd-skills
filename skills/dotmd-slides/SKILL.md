---

name: dotmd-slides

description: Create and improve DotMD Slides decks from briefs or documents, including narrative structure, slide content, speaker notes, accessibility, and presentation review.

---

# DotMD Slides

## Plan first

Identify the audience, decision or outcome, time limit, source material, and desired slide count. Draft an outline before changing the deck unless the request is a tiny correction.

## Build the narrative

- Read `dotmd_guide` with `topic: "slides"` and `slides_syntax` when deck syntax is unfamiliar. A deck is Markdown separated by `---` on its own line, with blank lines around each separator.
- Use `slides_validate` to check detected titles and slide count before creating with `slides_create`. Pass either a complete `markdown` deck or a `slides` array of per-slide Markdown.
- Opening: context and promise.
- Middle: evidence, explanation, options, or demonstration.
- Close: takeaway, decision, or next action.
- Keep one principal idea per slide.
- Make slide titles communicate the takeaway.
- Move delivery detail into presenter notes when supported.
- Presenter notes can use `<!-- notes: delivery cues -->` within a slide. Preserve existing notes and leading theme frontmatter. Notes are hidden from the audience view but remain in Markdown source; do not treat them as confidential in a shared source or export.

## Visual discipline

Prefer concise text, consistent hierarchy, readable charts, strong contrast, and meaningful images. Do not invent imagery or data. Add text alternatives or equivalent descriptions where supported.

## Editing safety

Read the whole outline before reordering. Preserve presenter notes and references. Confirm before deleting slides or replacing the deck. Never publish or start a live presentation without explicit instruction.

Read with `file_read`, then use `apply_edits` for focused changes within a slide. Anchors match visible plain text in one text leaf, without Markdown markers. Split a multi-block slide revision into its affected text blocks: `modify` writes text within a node, not a complete parsed slide. `add` inserts rich Markdown after an anchored top-level block; verify its anchor exists because a miss appends at the deck end. Check slide boundaries after insertion. There is no separate slide-edit tool. For an explicitly requested whole-deck replacement, use `file_write` with `expectedType: "slides"`.

MCP writes deck content; presentation controls, audience following, and preview are web interactions. Use the web preview to assess overflow and notes visibility when available.

## Verify

Review slide order, slide count, theme consistency, overflow, images, charts, notes, and the final call to action. Report sources not independently verified.
