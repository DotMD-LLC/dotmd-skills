---

name: dotmd-sheets

description: Work with DotMD Sheets data, formulas, formatting, sorting, filtering, and charts using range-aware, preview-first changes.

---

# DotMD Sheets

## Inspect before changing

1. Confirm the Sheet and relevant range.
2. Read headers, sample rows, formats, formulas, and blank regions.
3. State what one row represents.
4. Identify keys, totals, dependent formulas, and charts.

## Make safe edits

- Use explicit ranges.
- Keep headers separate from data.
- Preserve identifier and formula columns unless the request targets them.
- Preview bulk updates, sorts, replacements, row deletion, and column deletion.
- Never convert blanks to zero or missing records to empty content silently.
- Explain proposed formulas and test an example before filling them down.

## Analyze

Distinguish source data from inference. State filters, grouping, date boundaries, units, and excluded rows. Flag duplicates, missing values, inconsistent types, outliers, and formula errors.

## Charts

Confirm the source range and question. Use a chart suited to the comparison, label units, and state the takeaway in the title. Avoid charts that hide missing or incomparable data.

## Verify

Read back changed ranges, sample first and last affected rows, recalculate dependent values where available, and confirm charts still reference the intended data.