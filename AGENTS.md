# AGENTS.md

## Project Shape

- This is a VitePress knowledge site. Source content lives under `docs/` and the site config lives in `docs/.vitepress/config.ts`.
- Topic landing pages are split across `docs/ai-agent/`, `docs/python-automation/`, `docs/web-react/`, and `docs/rpa-playwright/`.
- Static assets that should be served by the site belong in `docs/public/`; do not edit generated output under `docs/.vitepress/dist/`.

## Commands

- Install dependencies with `pnpm install`.
- Run the local dev server with `pnpm docs:dev`.
- Verify production output with `pnpm docs:build` (this also runs `pnpm readme:sync` first).
- Refresh the site-wide navigation in `README.md` with `pnpm readme:sync`.
- Preview a built site with `pnpm docs:preview` after building.

## Deployment

- GitHub Pages deployment is defined in `.github/workflows/deploy.yml` and runs on pushes to `main`.
- The workflow uses Node 20, pnpm 10, `pnpm install --frozen-lockfile`, `pnpm docs:build`, then publishes `docs/.vitepress/dist`.
- For any change that will be pushed and published, update `CHANGELOG.md` in the same commit with a concise user-facing note.
- When the user says to publish a new version, run `pnpm docs:build`, inspect the git diff, and create a git commit for the intended changes without waiting for another prompt.

## README Sync

- `README.md` is a generated site navigation, not a deployment guide. It must always reflect the current `docs/` directory.
- It is regenerated automatically by `scripts/sync-readme.mjs`. Run `pnpm readme:sync` after any of the following:
  - Adding, renaming, or removing an article under `docs/<topic>/` or `docs/blog/`.
  - Changing an article `title:` in frontmatter.
  - Updating the top-level page list or site URL.
- Do not hand-edit `README.md` for content that comes from `docs/`; the next sync would overwrite it. Hand-edits are only allowed for the header or maintenance notes outside the auto-generated sections.

## Content Guidance

- Add long-form posts under `docs/blog/` with readable English slugs.
- Keep old blog migration content organized by topic instead of copying old random short URLs.
- Update this file when adding real lint, test, format, or deploy commands; do not document commands that are not present in `package.json` or CI.
