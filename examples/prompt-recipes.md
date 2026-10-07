# DotMD prompt recipes

Replace bracketed text with your details. Always name whether the assistant may edit, comment, or only inspect.

## Draft a Doc

> Use the DotMD Docs skill. Create a Doc titled “\[title\]” in “\[folder\].” The audience is \[audience\], and the goal is \[goal\]. Use \[source items\] as evidence. Draft \[sections\]. Do not share or publish it. Report assumptions and sources that need verification.

## Improve an existing Doc

> Review “\[Doc title\]” for \[clarity/accuracy/tone/structure\]. Preserve terminology and links. Directly fix small language issues, but use comments for factual uncertainty or changes in meaning. Summarize every changed section.

## Create Slides from a Doc

> Use the DotMD Slides skill. Turn “\[source Doc\]” into a \[number\]-slide deck for \[audience\]. The desired outcome is \[decision/action\]. Show the outline first. Add presenter notes, keep one message per slide, and do not publish.

## Audit a Sheet

> Use the DotMD Sheets skill. Inspect “\[Sheet title\]”, especially range \[range\]. Identify missing values, duplicates, inconsistent formats, formula errors, and outliers. Do not edit yet. Return a proposed cleanup plan with affected ranges.

## Add formulas safely

> In “\[Sheet title\]”, propose a formula for \[outcome\] using \[columns/range\]. Explain it with one worked example. After I approve, apply it only to \[range\], then verify the first and last affected rows.

## Run a review

> Use the DotMD Collaboration skill. Review “\[item\]” as \[role/perspective\]. Add comments only—do not edit or resolve threads. Focus on \[criteria\]. Mention \[person\] only where a direct response is required.

## Create an interactive Art

> Use the DotMD Arts skill. Create an Art titled “\[title\]” for \[audience\] from “\[source item\].” Build \[mock/report/calculator\] with working local controls, responsive layout, visible focus, and readable light/dark appearance. Label sample data and simulated actions. Validate the package, save it, and read it back. Do not share or publish. Tell me whether you tested the rendered interactions.

## Refine an Art

> Read the current “\[Art title\]” and its revision ID. Change only \[requested behavior or visual detail\], preserving its content, design, and stable component IDs. Validate the replacement package, update using the current revision, and read back the saved result. If it changed meanwhile, reconcile the latest Art before retrying. Report comments that need a new target; do not resolve them automatically.

## Review an Art with component comments

> Use the DotMD Arts skill. Read “\[Art title\]” and inspect \[criteria\]. Add focused component comments on its current revision using the package's component IDs. Do not change the package, re-create existing threads, or publish. Separate issues you verified in the rendered Art from issues found in the package.

## Procedural Arts and embedding

Discover the connected MCP catalog and schemas before using these workflows. If the required tool is unavailable, report that limit; installing a skill does not deploy a hosted capability.

### Explore a procedural product

> Discover the available 3D runtimes and prepare the product-showcase starter. Use illustrative geometry and labelled controls. Show the proposal before saving it; check responsive and 390px previews in light and dark. Preserve the runtime declaration when refining the material choices.

### Explain a spatial relationship

> Prepare the spatial-diagram starter for the concepts I provide. Keep a readable parallel list of nodes and relationships, native selection controls, and an explanation outside the canvas. Use sample labels only when real source content is missing, and identify them as illustrative.

### Demonstrate bounded motion

> Prepare the interactive-simulation starter with labelled inputs, pause, Reset view, and a reduced-motion alternative. Explain what the model illustrates. Verify the controls before claiming that the simulation works.

### Put an existing Art in a Doc

> Read the named Art and Doc. Enable embedding only if my request authorizes the owner action, then insert its canonical Doc iframe in the requested passage while preserving neighboring content. Keep current Art access. Do not publish or share either artifact as part of this insertion. Read the Doc back and check the rendered iframe.

## Prepare for publishing

> Inspect “\[item\]” for public release. Check sensitive information, internal links, draft comments, structure, accessibility, and media. Do not publish. Return blockers and a final pre-publication checklist.

## Sync a GitHub folder

> Use the DotMD GitHub Sync skill. Inspect the link between “\[DotMD folder\]” and “\[owner/repo\]” branch “\[branch\]” at “\[path\].” Summarize inbound, outbound, and conflicting changes. Do not sync or create a pull request until I approve.

## Recover content

> Compare the current “\[item\]” with the version from \[time/version\]. Explain what would be lost and restored. Do not restore. If only one section is missing, recommend the narrowest recovery.
