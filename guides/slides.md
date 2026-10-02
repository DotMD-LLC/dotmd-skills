# DotMD Slides

DotMD Slides turns Markdown-centered content into a presentation.

## Create a deck

1. Create a Slides item or choose a presentation template.
2. Define the audience, desired outcome, and time limit.
3. Draft an outline before polishing individual slides.
4. Keep one main idea per slide.
5. Use slide separators and the Slides controls to organize the deck.

## Design for a live audience

- Prefer short headlines and supporting evidence over paragraphs.
- Use consistent layouts and a restrained theme.
- Give charts and images a clear takeaway.
- Put delivery cues and supporting detail in presenter notes when available.
- Check contrast, type size, reading order, and alternative descriptions.

## Reorder and review

Use the slide list or navigation controls to add, duplicate, delete, and reorder slides. After structural edits, confirm that transitions, references, and slide numbers still make sense.

## Present

Open Present mode, enter full screen if appropriate, and navigate with the visible controls or arrow keys. Test the deck on the screen and browser you will use. Keep a shareable or exported fallback for important meetings.

## Export and share

Preview the entire deck before exporting or publishing. Confirm fonts, images, charts, notes, and page breaks in the final artifact.

Use the [DotMD Slides skill](../skills/dotmd-slides/SKILL.md) to turn briefs and Docs into presentation-ready narratives.

## Through MCP

Read `slides_syntax` or `dotmd_guide` with `topic: "slides"`. Separate slides with `---` on its own line and blank lines around it, then use `slides_validate` to check slide count and detected titles. `slides_create` accepts a complete Markdown deck or an array of individual slide bodies.

For an existing deck, read `file_read` and use `apply_edits` for focused text-block changes within a slide. Anchors use visible plain text without Markdown markers; a multi-block slide is not one `modify` target. Check the anchor before an `add`, because a missing anchor appends at the deck end, and verify the resulting slide boundaries. `file_write` with `expectedType: "slides"` replaces the entire deck; reserve it for an intended full replacement.

Presenter notes can be written as `<!-- notes: delivery cues -->` inside a slide. They are hidden from the audience view but remain in shared Markdown source and source exports. Keep confidential information out of them. MCP authors content; the web interface owns Present mode, audience following, and visual preview.
