# AGENTS.md

## AI Engineering Documentation

All durable AI engineering documentation for `my-knowledge` is under `docs/`.

Before working:

1. Read `docs/agents/README.md` and `docs/agents/workflow.md`.
2. Read `docs/context/CONTEXT.md` and relevant files under `docs/adr/`.
3. Read the active record under `docs/issues/`.

Track project work locally according to `docs/agents/issue-tracker.md`. Preserve source provenance and never turn an unconfirmed inference into project truth.

## Project Shape

- This is a VitePress knowledge site. Source content lives under `docs/` and the site config lives in `docs/.vitepress/config.ts`.
- Topic landing pages are split across `docs/ai-agent/`, `docs/python-automation/`, `docs/web-react/`, and `docs/rpa-playwright/`.
- Static assets that should be served by the site belong in `docs/public/`; do not edit generated output under `docs/.vitepress/dist/`.

## Commands

- Install dependencies with `pnpm install`.
- Run the local dev server with `pnpm docs:dev`.
- Verify production output with `pnpm docs:build` (this also runs `pnpm readme:sync` and `pnpm design:lint` first).
- Refresh the site-wide navigation in `README.md` with `pnpm readme:sync`.
- Validate the `DESIGN.md` visual system spec with `pnpm design:lint` (also runs as part of `pnpm docs:build`).
- Preview a built site with `pnpm docs:preview` after building.

## Deployment

- GitHub Pages deployment is defined in `.github/workflows/deploy.yml` and runs on pushes to `main`.
- The workflow uses Node 20, pnpm 10, `pnpm install --frozen-lockfile`, `pnpm docs:build`, then publishes `docs/.vitepress/dist`.
- For any change that will be pushed and published, update the current monthly file under `docs/changelog/` in the same commit according to `docs/agents/issue-tracker.md`.

## README Sync

- `README.md` is a generated site navigation, not a deployment guide. It must always reflect the current `docs/` directory.
- It is regenerated automatically by `scripts/sync-readme.mjs`. Run `pnpm readme:sync` after any of the following:
  - Adding, renaming, or removing an article under `docs/<topic>/` or `docs/blog/`.
  - Changing an article `title:` in frontmatter.
  - Updating the top-level page list or site URL.
- Do not hand-edit `README.md` for content that comes from `docs/`; the next sync would overwrite it. Hand-edits are only allowed for the header or maintenance notes outside the auto-generated sections.

## Content Guidance

- Add long-form posts under `docs/blog/` with readable English slugs.
- Use the "blue engineering hand-drawn knowledge card" defined in `DESIGN.md` as the default visual style for article illustrations. Treat deviations as intentional exceptions justified by the article's evidence or medium.
- Generate hand-drawn article artwork without final Chinese text or model-drawn label boxes. Add verified titles, labels, borders, captions, and alt text deterministically in SVG after the artwork is stable.
- When adding a new article, add it to the top of the "最新文章" section in `docs/index.md` by default.
- Before adding a new article to the "推荐阅读" section in `docs/index.md`, always ask the user whether it should be included.
- Keep old blog migration content organized by topic instead of copying old random short URLs.
- Update this file when adding real lint, test, format, or deploy commands; do not document commands that are not present in `package.json` or CI.

<!-- BEGIN brain.md -->
## Project Brain

This project keeps a **Project Brain**: a persistent memory layer of its durable decisions, requirements, and constraints. Read `./BRAIN.md` for the full read/write contract.

Maintain the brain as part of normal coding work — not as a separate task. While discussing or implementing features:
- **Start of a task:** load relevant context with the `brain` CLI (`list-pages`, `read-page`, `read-root`). Prefer a narrow read over scanning everything.
- **When a decision, requirement, constraint, or durable insight settles** (in chat or while coding): capture it immediately via the `brain` CLI. Do not wait to be asked and do not batch it for later.
- **Pure implementation with no new decision:** do not write to the brain.
- **When overturning a prior conclusion:** update the page (`update-truth` and/or `append-timeline` with `kind: reversal`, or `archive-page`).
- Only store what will still matter in six months and is hard to reconstruct from the code alone.
- All reads and writes go through the `brain` CLI — never hand-edit brain files.

The brain skills (`brain-setup`, `brain-page`, `brain-ingest`, `brain-bootstrap`) are installed in your global skills directory. Prefer `brain init` to scaffold a new project.
<!-- END brain.md -->
