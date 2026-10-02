# Arts

Arts are interactive visuals saved as first-class DotMD files: UX mocks, visual reports, invitations, calculators, and small demos. People and connected AI can review the same Art with comments, versions, permissions, and sharing.

An Art contains self-contained HTML, CSS, and optional JavaScript. Choose a Doc for prose, Slides for a presentation, or a Sheet for a working dataset.

## Create in the web app

1. Choose **New → Art** and give it a clear title.
2. Describe the audience, visual style, content, and what each control should do. You can optionally supply a DotMD source link or ID that you can access; the source stays unchanged.
3. Choose **Generate preview**. Generation uses the AI connection available to your account. If consent is required, complete it in the app.
4. Try the result in **Responsive** and **Mobile** preview. Test its controls and keyboard navigation. For an Art with adaptive appearance, compare **Follow DotMD** and **Original art**, including light and dark themes.
5. Refine the prompt, **Discard** the proposal, or choose **Accept Art** to save it. For an existing Art, **Compare with saved** helps review what the proposal will replace.

Generation and acceptance are separate steps. The saved version stays unchanged while you review a proposal. If a collaborator changes the Art meanwhile, review the latest saved version before accepting the replacement. **Stop** cancels generation; usage already consumed still counts.

Use **Create / refine** for follow-up changes and **Version history** to review earlier content. A runtime error can be retried with **Restart preview**. Fix reported accessibility issues and check the result yourself; automated checks do not cover every interaction or assistive technology.

## Work with an AI client through MCP

The connected assistant writes the package. Despite its name, `art_generate` prepares a supplied package; it does not call an AI model.

| Tool | Use it to |
| --- | --- |
| `art_validate` | Check a proposed package and return issues or a normalized package |
| `art_generate` | Validate and canonicalize a package authored by the assistant |
| `art_create` | Save a new Art with a title and optional authorized namespace |
| `art_read` | Read the saved package and its revision ID |
| `art_update` | Save a replacement package using the current revision ID |
| `art_comment_add` | Pin feedback to a component in the current revision |
| `art_publish` | Publish a personal Art owned by the connected account |

For an update, the assistant reads the Art first, validates the revised package, then passes the returned `revisionId` to `art_update`. Stale updates are refused. The assistant must reconcile the latest content before retrying. A `null` revision ID is used only when the Art is empty.

MCP creation and updates save directly; they do not create a pending **Accept Art** proposal in the web app. Tell the assistant whether to save changes or prepare a preview for review. It should read the result back and distinguish package validation from a rendered interaction check.

Use the [DotMD Arts skill](../skills/dotmd-arts/SKILL.md) for package authoring. Discover current tool schemas in your connected client; access is limited by the account, role, namespace, and MCP scope.

## Package formats

| Format | Content | Source limit |
| --- | --- | --- |
| Fragment | HTML beginning with one `main` and one `h1`, separate CSS, optional separate local JavaScript | 250,000 bytes total |
| Bundle | Complete HTML document with inline styles, scripts, and bundled dependencies; separate CSS empty and JavaScript null | 5 MiB total |

Both formats include `html`, `css`, `javascript`, `prompt`, `generation`, and `assets`. Unused optional content uses `null` or an empty asset list. Validation may normalize the package and assign commentable component IDs, so use the returned package for writing. Up to 250 components can be exposed for comments. Framework bundles need stable component declarations matching their rendered `data-art-id` values for precise feedback.

Existing authorized image assets can be declared in `assets` and referenced as `asset://ASSET_ID`. The Arts tools do not upload assets. Bundles may inline image and font data. Fragments keep script/style elements, inline event attributes, data URLs, and CSS `url()` out of the HTML/CSS package.

`themeMode` can be `adaptive` or `original`. Adaptive Arts can follow DotMD appearance when their styles use the Art theme variables; original Arts keep their authored palette. Leaving it out preserves the original palette. The [Arts skill](../skills/dotmd-arts/SKILL.md) lists the variables for authoring.

## Runtime limits

Arts run local interactions with in-memory state. They cannot depend on remote APIs, external styles or scripts, popups, downloads, frames, forms, external navigation, browser permissions, location/history APIs, or persistent browser storage. Their saved content persists in DotMD; temporary inputs and demo state reset when the preview restarts.

Use native buttons, disclosures, and local handlers for real interactions. A section link can scroll and focus a matching `#id` inside the Art. Label sample data and simulated actions clearly. A “Send,” “Pay,” or “Sync” demo does not perform that external action.

Use a Doc, Sheet, supported integration, or a separate application when the work needs live data, durable records, or an external transaction.

## Comments and revisions

In the web app, use **Comment on a component** to select or click a target, or select text for feedback. Comments use the shared discussion channel, so reviewers can reply, react, resolve, and reopen threads with the permissions their role allows.

Through MCP, `art_comment_add` takes `docId`, the current `revisionId`, a component `artId`, `x` and `y` between 0 and 1, and the comment body. Read the package to obtain the current component IDs. Stale revisions or missing targets are refused.

A component comment stays tied to its original revision. After a replacement, check **Comments needing a new target** and explicitly reattach affected comments in the web app. The Arts MCP tools do not include a reattachment operation.

## Sharing and publishing

Use **Share** for document access and the publishing controls for a public result. Sharing and public publication are separate states.

`art_publish` publishes only a personal Art owned by the connected account and returns a public viewing URL. It cannot publish an Art in a namespace or an Art the account merely edits. Publishing requires the user's instruction for that Art; existing authorization does not need to be requested again.

Check sensitive content, sample data, controls, mobile layout, accessibility, and media before public release. A published Art remains an interactive viewing experience, not an exported office file. See [Sharing and publishing](sharing-and-publishing.md).
