# DotMD Sheets

DotMD Sheets is for structured data, calculations, trackers, and charts.

## Start with structure

1. Decide what one row represents.
2. Give every column one meaning and a clear header.
3. Keep identifiers stable.
4. Use consistent formats for dates, numbers, currencies, and statuses.
5. Separate raw inputs from summaries when the dataset grows.

A blank Sheet treats row 1 as ordinary data. When row 1 contains your column labels, enable its header setting. Through MCP, use `sheet_configure` with `firstRowIsHeader: true` and the target worksheet's `sheetId`.

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
- areas for accumulated trends;
- donut or funnel charts for a suitable part-to-whole or stage comparison;
- heatmaps, bullet charts, or timelines when their required source columns match the question.

The native chart types are bar, line, area, donut, funnel, heatmap, bullet, and timeline. Labels and series remain tied to their Sheet ranges, so changing the underlying cells changes the chart.

State the takeaway in the title and verify the source range after structural edits.

## Collaboration safety

For broad changes, summarize the proposed range and operation first. Avoid overwriting cells you have not inspected. Report formulas and changed ranges explicitly.

Use the [DotMD Sheets skill](../skills/dotmd-sheets/SKILL.md).

## Through MCP

Read workbook Markdown with `file_read`. Use `sheet_apply_edits` to write cells as `{ cellRef, value }`, with string values, formulas starting with `=`, and an empty string to clear a cell. Pass the worksheet's actual `sheetId` when targeting another tab. `apply_edits` cannot edit a Sheet.

`sheets_create` imports a GFM table: its Markdown header labels the columns and is not an actual grid row. The first data row becomes row 1. For chart labels in A1/B1, include labels as the first table body row when creating the Sheet. If row 1 already holds data, preserve the data and dependent formulas before adding labels; do not overwrite the first record. Configure the first row as a header when the label cells are in place.

Use `sheet_chart` to list, create, update, or delete a native chart. Creation uses an A1 range such as `A1:B8`; obtain an existing `chartId` by listing before updating it. Check the tool schema for the selected chart type's range requirements.

The web editor has controls beyond these focused tools. Do not assume MCP exposes every formatting, sorting, filtering, tab, or row/column operation. A whole-workbook replacement can discard those settings and concurrent work; use it only when deliberately requested.
