# DotMD Sheets

DotMD Sheets is for structured data, calculations, trackers, and charts.

## Start with structure

1. Decide what one row represents.
2. Give every column one meaning and a clear header.
3. Keep identifiers stable.
4. Use consistent formats for dates, numbers, currencies, and statuses.
5. Separate raw inputs from summaries when the dataset grows.

## Enter and edit data

- Select a cell or range before typing, formatting, or applying a command.
- Paste rectangular data into the top-left destination cell.
- Review transformed or imported data before replacing the original.
- Use row and column operations carefully when collaborators are active.

## Formulas

Enter a formula with `=` and reference cells or ranges. Prefer readable formulas, avoid hidden assumptions, and test edge cases such as blanks, zero values, and errors. When an AI proposes formulas, ask it to explain inputs and expected output before applying them.

## Sort and filter

Confirm whether a sort affects the whole dataset or only a selection. Keep headers out of the data range. Use filters to explore without destroying the underlying records.

## Charts

Choose a chart that matches the question:

- bars for category comparisons;
- lines for change over time;
- scatter plots for relationships;
- compact summary charts only when labels remain readable.

State the takeaway in the title and verify the source range after structural edits.

## Collaboration safety

For broad changes, summarize the proposed range and operation first. Avoid overwriting cells you have not inspected. Report formulas and changed ranges explicitly.

Use the [DotMD Sheets skill](../skills/dotmd-sheets/SKILL.md).