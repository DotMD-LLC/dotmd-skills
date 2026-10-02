# Public DotMD skills repository design

## Goal

Create a public, documentation-only repository that helps people learn DotMD and gives AI assistants safe, practical instructions for working with DotMD content.

## Publishing boundary

This repository contains original public-facing prose only. It must never contain product source code, private repository history, internal architecture, infrastructure identifiers, credentials, customer data, private screenshots, unreleased roadmap claims, or copied engineering documents.

## Structure

- `README.md`: product story, quick start, feature map, skill catalogue, and examples.
- `guides/`: task-based user documentation for released product areas.
- `skills/`: portable `SKILL.md` packages for general DotMD work and specialized workflows.
- `examples/`: reusable prompt recipes.
- Governance files: license, contributing, security, and code of conduct.

## Content principles

- Describe outcomes and user-visible behavior, not implementation.
- Use DotMD's exact brand casing.
- Keep permission boundaries explicit; agents never widen access or publish implicitly.
- Treat AI output as a proposal that the user reviews.
- Prefer reversible actions and preview/read-before-write workflows.
- Link to `https://dotmd.co` as the product destination.

## Verification

Before publishing, check Markdown links, required skill frontmatter, placeholders, secrets and token patterns, references to private repository names or local paths, and Git history. After publishing, verify the repository is public and the remote default branch matches the local commit.
