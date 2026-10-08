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
| Arts | PNG and standalone HTML, when available for the accepted revision |

Markdown preserves portable content. A Sheet workbook export can retain tabs and formatting; CSV/TSV exports the active sheet's evaluated values for interchange. PDF provides a reading or printing copy and requires an eligible plan. Export availability can also depend on content and connection status; use the options shown in the current editor.

Supported imports do not imply matching office exports: the web export menus do not offer DOCX, PPTX, or XLSX. Slides file import uses Markdown. Through MCP, discover the formats offered by `file_export`; those options differ from the web menu. Docs, Slides, and Sheets retain their existing Markdown, print-ready HTML, and PDF output contracts; their HTML option is available through MCP rather than their web export menus.

## Arts packages

Arts use governed, self-contained HTML packages. Through MCP, use `art_read` to retrieve the saved package and `art_create` or `art_update` to save a validated package. Use the current revision ID when updating. The Arts tools do not offer general file import or office/Markdown export.

Discover the connected catalog before using Arts export tools; a local skills/package candidate does not prove hosted availability. On a current Premium plan, `file_export` accepts `docId`, `format: "png"` or `"html"`, and the current accepted `revisionId` from `art_read`. PNG requires integer dimensions from 320 to 4096, at most 8,388,608 pixels. Both formats accept `appearance: "original"` or `light`, `paper`, `mist`, `dark`, `black`, or `dusk`, defaulting to `original`. HTML omits dimensions. Stale revisions are refused. PNG renders a fresh accepted scene; it does not capture an unsaved camera position.

Arts exports return authorized job metadata. Use its `docId` and returned `jobId` with `file_export_get_job` for an explicit status read when needed, without polling. Once ready, `file_export_download` uses the same IDs and returns base64 chunks: decode and concatenate the bytes in offset order, advance by returned `byteLength`, and stop at `eof`. `offset` defaults to 0; requested `length` is an integer from 1 to 262,144 bytes, defaulting to 65,536. All three export tools allow read-only scope. The current Premium plan and Art access are rechecked for creation, status, and download; status and downloads also require ownership of the export job. Metadata exposes no storage key or bearer download URL. Docs/Slides/Sheets HTML still returns `content`, and synchronous PDF still returns `pdfBase64`; neither uses the Arts chunk flow. Verify the PNG dimensions and visible scene, or open the standalone HTML with network blocked. Delivered copies cannot be revoked.

`art_publish` returns a public viewing URL, not an exported file. See [Arts](arts.md) for fragment and bundle authoring, runtime limits, and review.

## Quality check

Open the exported artifact with its intended application. Confirm the title, page or slide order, media, formulas or values, links, and filename. Do not claim an export is usable solely because a download completed.
