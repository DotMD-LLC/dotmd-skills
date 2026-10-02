# Import and export

## Import

Use Import in the relevant editor. The current file inputs are:

| Content type | File formats |
| --- | --- |
| Docs | Markdown (`.md`, `.markdown`) and Word (`.doc`, `.docx`) |
| Slides | Markdown (`.md`, `.markdown`) |
| Sheets | Markdown, CSV, TSV, XLS, and XLSX |

Review the import preview and any conversion report before replacing existing content. PowerPoint files are not a Slides file-import format.

Before importing:

- keep an untouched copy of the original;
- choose the correct DotMD content type;
- decide whether the import creates a new item or replaces content;
- separate very large or unrelated artifacts.

After importing, review headings, tables, lists, links, images, slide boundaries, formulas, dates, and special formatting. Conversion is rarely perfect for complex proprietary layouts.

## Export

Choose an export based on what the recipient needs:

| Content type | Web export formats |
| --- | --- |
| Docs and Slides | Markdown and PDF |
| Sheets | Markdown with formulas, Markdown with evaluated values, CSV, TSV, and PDF |

Markdown preserves portable content. A Sheet workbook export can retain tabs and formatting; CSV/TSV exports the active sheet's evaluated values for interchange. PDF provides a reading or printing copy and requires an eligible plan. Export availability can also depend on content and connection status; use the options shown in the current editor.

Supported imports do not imply matching office exports: the web export menus do not offer DOCX, PPTX, or XLSX. Slides file import uses Markdown. Through MCP, discover the formats offered by `file_export`; those options differ from the web menu. HTML is an MCP export option for supported content, not a web export menu item.

## Arts packages

Arts use self-contained HTML packages. Through MCP, use `art_read` to retrieve the saved package and `art_create` or `art_update` to save a validated package. Use the current revision ID when updating. The Arts tools do not offer general file import or office/Markdown export, and `file_export` does not export Arts.

`art_publish` returns a public viewing URL, not an exported file. See [Arts](arts.md) for fragment and bundle authoring, runtime limits, and review.

## Quality check

Open the exported artifact with its intended application. Confirm the title, page or slide order, media, formulas or values, links, and filename. Do not claim an export is usable solely because a download completed.
