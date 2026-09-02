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

## Prepare for publishing

> Inspect “\[item\]” for public release. Check sensitive information, internal links, draft comments, structure, accessibility, and media. Do not publish. Return blockers and a final pre-publication checklist.

## Sync a GitHub folder

> Use the DotMD GitHub Sync skill. Inspect the link between “\[DotMD folder\]” and “\[owner/repo\]” branch “\[branch\]” at “\[path\].” Summarize inbound, outbound, and conflicting changes. Do not sync or create a pull request until I approve.

## Recover content

> Compare the current “\[item\]” with the version from \[time/version\]. Explain what would be lost and restored. Do not restore. If only one section is missing, recommend the narrowest recovery.