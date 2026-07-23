# Changelog

All notable published changes to this knowledge site are recorded here.

## 2.1.7 - 2026-07-23

- Updated the Codex Switch Helper guide for v0.2.8 with new watermarked screenshots, shared third-party Plugin management, clearer product advantages, and a direct GitHub Star call to action.
- Corrected the project descriptions on the About and Resources pages to reflect process-local credentials, isolated Profile data, concurrent instances, and shared resources.

## 2.1.6 - 2026-07-23

- Reworked the Vibe Coding governance article with evidence from METR, DORA, NIST, and GitHub, plus two original diagrams explaining risk accumulation and the governed delivery loop.

## 2.1.5 - 2026-07-23

- Updated the Codex Switch Helper guide for v0.2.7, covering isolated Profile homes, concurrent Codex instances, in-Profile sign-in, shared AGENTS.md and Skills, and current security boundaries.

## 2.1.4 - 2026-07-23

- Reworked the Plugin, Skill, and MCP guide with six hand-drawn narrative infographics, clearer in-image explanations, and consistent site watermarking.

## 2.1.3 - 2026-07-22

- Published a practical guide to choosing and planning Plugin, Skill, and MCP capabilities for AI Agent workflows, including boundaries, permissions, and rollout strategy.

## 2.1.2 - 2026-07-21

- Added a curated long-term recommendations section to the resource navigation, with practical fit, rationale, cautions, and category-level recommendation markers.

## 2.1.1 - 2026-07-20

- Added site-wide anonymous analytics to track page views, article visits, traffic sources, and navigation paths.

## 2.1.0 - 2026-07-17

- Refined the homepage 3D character into a smaller AI pet with articulated limbs, organic idle behaviors, pointer attention, petting, dragging, and momentum-aware release reactions.
- Added the AI 编程工程 topic with six guides covering Vibe Coding governance, project contracts, delivery loops, Skill lifecycle, external integrations, and security boundaries.
- Updated the public `AGENTS.md` and Agent Skills snapshots, including the current agent identity, synchronization date, `ui` Skill name, and lifecycle guidance.
- Expanded Loop Engineering with executable stop conditions and updated site navigation and README generation for the new topic.

## 2.0.3 - 2026-07-16

- Published a Codex benchmark of 12 Vibe Coding plugins and skill collections, with reproducible task fixtures, scoring scripts, and run traces.
- Moved recent-update notifications into the shared top navigation and added per-article unread indicators with version-aware read state.
- Reorganized the homepage around recommended reading, latest articles, and hands-on projects.
- Replaced the photographic character composition with a transparent, animated full-body 3D CRT archivist that defaults to the bottom-right and can be dragged anywhere within the viewport.

## 2.0.2 - 2026-07-16

- Added a homepage notification menu for articles published or updated within the last seven days.
- Added version-aware read tracking in localStorage so content changes at an existing URL become unread again without flooding first-time visitors with old articles.

## 2.0.1 - 2026-07-16

- Added the Anthropic Claude AI engineering course to the curated reading page.
- Added OfficeCLI to the AI Agent open-source project resources.

## 2.0.0 - 2026-07-14

- Rebuilt the homepage as a full-screen dark editorial experience with responsive navigation, typewriter copy, and topic actions.
- Added a real-time Three.js CRT character head that follows the pointer with full horizontal rotation and restrained downward movement.
- Unified the 3D head and photographic body in one responsive scene coordinate system, including dedicated mobile composition and a regression check.
- Replaced the former Warm Bronze / Codex style switcher with the standard light/dark theme control while retaining the Codex Helper visual language for article pages.

## 0.1.7 - 2026-07-14

- Published an illustrated guide to the four Agent loop structures, with locally stored static and animated source media.
- Added the Claude Code loop guide and Everything Claude Code Chinese guide to the curated reading page.
- Added DeepTutor and MotionSites to the resource navigation.

## 0.1.6 - 2026-07-13

- Added a curated external reading page, starting with a guide to using Git history before reading unfamiliar code.
- Synchronized the public `AGENTS.md` page with the current global collaboration rules.
- Renamed the curated external reading page to “好文分享” to distinguish it from the existing resource navigation.

## 0.1.5 - 2026-07-13

- Removed decorative emoji and generic promotional phrasing across imported articles while preserving meaningful technical examples and historical source metadata.
- Improved dark-mode contrast for both site styles, simplified the Codex Helper hero treatment, bundled LXGW WenKai Screen locally, and improved the style switcher's accessible label and mobile touch target.
- Added `kill-ai-slop` to the public Agent Skills directory with its purpose, source repository, and global installation command.

## 0.1.4 - 2026-07-13

- Added the Codex Switch Helper guide to the homepage's latest and recommended reading sections.
- Documented that new articles must be added to the homepage's latest articles by default and require user confirmation before being added to recommended reading.

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
