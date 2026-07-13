# Changelog

All notable published changes to this knowledge site are recorded here.

## 0.1.3 - 2026-07-13

- Published and indexed a practical introduction to Codex Switch Helper, covering Windows Profile switching, shared and sandbox environments, authentication behavior, proxy settings, update delivery, and current security boundaries.
- Expanded the published Agent collaboration guidance and added explicit pnpm workspace metadata.

## 0.1.2 - 2026-07-09

- Published the global `AGENTS.md` collaboration rules and a curated catalog of public Agent Skills with their purposes, source repositories, and installation commands.

## 0.1.1 - 2026-07-09

- Added a persistent site-style switcher between the default Warm Bronze reading theme and a Codex Helper-inspired interface theme, including light/dark palettes and pre-render preference restoration.

## 2026-07-03

- Added the personal project `codex-switch-helper` to the about page as the first entry. It is a Tauri-based Windows desktop helper for switching Codex App profiles (account login / API key), managing user-level `CODEX_HOME` and `OPENAI_API_KEY`, and launching Codex via `shell:AppsFolder`.

## 2026-06-29

- Added homepage sections for recommended reading, latest articles, and hands-on projects so new visitors have clearer starting points.
- Sorted articles in the auto-generated README by `date` (newest first) within each topic, with title-pinyin as a tie-breaker. Added a `date:` field to the frontmatter of every article; new posts get the real publication date, while older imported articles are seeded with their initial git commit date.
- Fixed `scripts/sync-readme.mjs` incorrectly dropping `docs/python-automation/uv-python-package-index.md` from the generated README because the file name ends in `index.md`; the filter now uses `path.basename(file) === 'index.md'`.

## 2026-06-25

- Added 6 curated learning and discovery sites to the resources page.
- Created the VitePress knowledge site and GitHub Pages deployment workflow.
- Switched project commands and CI from npm to pnpm.
- Configured the custom domain `knowledge.webfrank.top`.
- Imported old blog articles into topic-based sections.
- Fixed imported article image paths and removed an empty duplicate article.
- Removed selected low-value imported articles.
- Improved local search for Chinese queries.
- Cleaned public copy so migration/internal maintenance notes do not appear on the frontend.
- Expanded the article page into a full-site article index grouped by topic.
- Added 5 open-source project entries (Agent-Reach, ponytail, headroom, OpenMontage, ProxyBridge) to the resources page with short descriptions.
- Added 3 personal projects (learning-project-coach-skill, quick-nav-extension, text-fragment-copier) to the about page with short descriptions.
- Replaced the deployment-style `README.md` with an auto-generated content navigation driven by `scripts/sync-readme.mjs` and `pnpm readme:sync`.
- Switched the local git committer to GitHub user `frank9306`.
- Added the DESIGN.md open-source project entry to the resources page with a short description.
- Added the codebase-memory-mcp and VidBee open-source project entries to the resources page with short descriptions.
- Added a `DESIGN.md` at the repository root describing the VitePress site's visual system in the [DESIGN.md spec](https://github.com/google-labs-code/design.md) format (YAML tokens + Markdown rationale); installed `@google/design.md` as a devDependency, added a `pnpm design:lint` script, and bound it to `pnpm docs:build` so production builds fail on a non-conforming `DESIGN.md` (currently 0 errors / 0 warnings).
- Published a new blog post "给 VitePress 站点加一份 DESIGN.md：把视觉系统交给 AI 编程 Agent" under `docs/blog/`, walking through how the `DESIGN.md` spec was applied to this VitePress site (token mapping from `custom.css`, lint pitfalls, CI integration).
