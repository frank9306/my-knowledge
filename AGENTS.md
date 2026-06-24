# AGENTS.md

## Project Shape

- This is a VitePress knowledge site. Source content lives under `docs/` and the site config lives in `docs/.vitepress/config.ts`.
- Topic landing pages are split across `docs/ai-agent/`, `docs/python-automation/`, `docs/web-react/`, and `docs/rpa-playwright/`.
- Static assets that should be served by the site belong in `docs/public/`; do not edit generated output under `docs/.vitepress/dist/`.

## Commands

- Install dependencies with `pnpm install`.
- Run the local dev server with `pnpm docs:dev`.
- Verify production output with `pnpm docs:build`.
- Preview a built site with `pnpm docs:preview` after building.

## Deployment

- GitHub Pages deployment is defined in `.github/workflows/deploy.yml` and runs on pushes to `main`.
- The workflow uses Node 20, pnpm 10, `pnpm install --frozen-lockfile`, `pnpm docs:build`, then publishes `docs/.vitepress/dist`.

## Content Guidance

- Add long-form posts under `docs/blog/` with readable English slugs.
- Keep old blog migration content organized by topic instead of copying old random short URLs.
- Update this file when adding real lint, test, format, or deploy commands; do not document commands that are not present in `package.json` or CI.
