---

name: dotmd-sheets

description: Create and edit DotMD Sheet cells, formulas, headers, and native charts through MCP, preserving workbook structure and clearly identifying web-only operations.

---

# DotMD Sheets

## Inspect before changing

1. Confirm the Sheet and relevant range.
2. Read headers, sample rows, formats, formulas, and blank regions.
3. State what one row represents.
4. Identify keys, totals, dependent formulas, and charts.

Read `file_read` for canonical workbook Markdown and `dotmd_guide` with `topic: "sheets"` or `"charts"` for current syntax. Discover the worksheet ID from workbook content before editing a specific tab; do not assume a visible tab name is its `sheetId`.

## Create a Sheet

Use `sheets_create` with a GFM Markdown table. Its table header labels imported columns and is not grid row 1: the first data row becomes row 1. For chart labels in A1/B1, seed the labels as the first table body row at creation. If data already occupies row 1, preserve and remap the data and dependent formulas before writing labels with `sheet_apply_edits`; never overwrite the first record to add a header. Then set `sheet_configure` with `firstRowIsHeader: true`; a blank Sheet treats its first row as data by default.

## Make safe edits

- Use explicit ranges.
- Use `sheet_apply_edits` with `docId`, the target `sheetId`, and an array of `{ cellRef, value }` entries. Values are strings; `""` clears a cell and values starting with `=` are formulas. Omit `sheetId` only when the first tab is intended.
- `apply_edits` cannot edit Sheets. `file_write` with `expectedType: "sheet"` replaces the entire workbook and is appropriate only for an explicitly intended full replacement.
- Keep headers separate from data.
- Preserve identifier and formula columns unless the request targets them.
- Preview bulk updates, sorts, replacements, row deletion, and column deletion.
- Never convert blanks to zero or missing records to empty content silently.
- Explain proposed formulas and test an example before filling them down.

## Analyze

Distinguish source data from inference. State filters, grouping, date boundaries, units, and excluded rows. Flag duplicates, missing values, inconsistent types, outliers, and formula errors.

## Charts

Confirm the source range and question. Use a chart suited to the comparison, label units, and state the takeaway in the title. Avoid charts that hide missing or incomparable data.

Use `sheet_chart` to `list`, `create`, `update`, or `delete` native charts. For creation, pass `docId`, `sheetId`, and an A1 `range`; supported types are `bar`, `line`, `area`, `donut`, `funnel`, `heatmap`, `bullet`, and `timeline`. Check the connected tool schema and range requirements before selecting a type. List first to obtain `chartId` for updates or deletion. Charts remain bound to evaluated source cells.

## Web and MCP boundaries

Cell writes, header configuration, and native chart operations have focused MCP tools. Inspect available tools before promising sorting, filtering, row/column operations, tab management, dropdowns, or formatting. Use the web interface for an unsupported operation instead of rebuilding the workbook to simulate it.

## Verify

Read back changed ranges, sample first and last affected rows, recalculate dependent values where available, and confirm charts still reference the intended data.
