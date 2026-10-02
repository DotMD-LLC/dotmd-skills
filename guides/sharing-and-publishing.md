# Sharing and publishing

Docs, Slides, Sheets, and Arts use shared access controls. A document link, an access grant, and a published page are separate things. Copying an ordinary item link does not change who can open it.

## Share with people

Open **Share**, add the intended person, and choose **Viewer**, **Commenter**, or **Editor**. Personal items accept an email address; team items let you choose namespace members. Check **People with access** afterwards.

Access can come directly, through a folder, or through General access. Removing a direct grant does not remove an inherited grant. Change the source shown in the access list when you need to remove that access.

## Team General access

Team items offer **Restricted**, **Everyone in the namespace**, and, when applicable, **Everyone in this folder**. General access can use **Inherit** or a specific role, capped by each person's namespace role.

A namespace groups people; a folder organizes content and can supply inherited permissions. Membership is required for team content, but it does not open every restricted item. Namespace Admin manages membership without automatically gaining access to every item. **Private** remains owner-only.

## Anyone with the link

On a Personal item you own, enable **Anyone with the link**, choose a role, and wait for the saved state before copying the link. Viewer access allows reading without signing in; commenting or editing requires sign-in. Team items use namespace, folder, and direct access rather than public link sharing.

Turn the link off to revoke access supplied by that link. Direct grants and publication remain independent, so check them too if the goal is to reduce the item's audience.

## Publish

Personal Docs offer **Publish as blog**. Personal Slides, Sheets, and Arts offer **Publish to web** where the Share dialog supports it. Use the controls available for the item and your ownership permissions.

Review the content and its media for private information, check the public reading layout, then enable publishing. Wait for **Published** and open the returned public link. Verify it signed out on desktop and a narrow screen when possible. Publishing does not require enabling an editable public link first.

Unpublishing changes the public page's availability. It does not revoke direct or link access, and previous copies or third-party caches may remain.

## Ask an AI assistant

Name the item, person or audience, role, and desired action. An instruction such as “Share this Sheet with Sam as a Commenter” authorizes that specific change; the assistant should not ask for the same authorization again.

Through MCP, the assistant can manage direct document grants, namespace membership, and Personal link sharing. It can publish an owner-held Personal Art with `art_publish`. Folder permissions, General access, other publication types, and unpublishing use the web controls. A request to edit or review an item does not also authorize making it public or sending its link to someone else.

`file_collaborators` returns direct grants only. It does not enumerate inherited folder/General access or link/public audiences, so an empty list does not prove owner-only access. To assess the audience, inspect the web Share dialog's **People with access**, General access, link, and publication controls.

See [Collaboration](collaboration.md) and the [DotMD Collaboration skill](../skills/dotmd-collaboration/SKILL.md).
