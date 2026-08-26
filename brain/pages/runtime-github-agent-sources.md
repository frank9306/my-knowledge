---
id: runtime-github-agent-sources
title: "在浏览器运行时读取公开 Agent 配置源"
category: decision
status: active
tags: [frontend github content]
created: "2026-08-26T17:01:23"
updated: "2026-08-26T17:01:36"
---

<!-- compiled_truth -->
## Decision

The public `/agents` and `/skills` pages read their changing sources from GitHub at browser runtime instead of storing manually synchronized snapshots.

## Rationale and alternatives

The source repositories change independently of this static VitePress site. Runtime reads remove rebuild-and-publish work for content-only source updates. GitHub Contents and Tree APIs are used because `raw.githubusercontent.com` was unreliable in the verified network environment. A server proxy was not added because the site is intentionally static.

## Scope and consequences

- `/agents` decodes `frank9306/ai-environment` `main/instructions/core.md` and renders it as source text, never remote HTML.
- `/skills` discovers `skills/<category>/<name>/SKILL.md` from the `frank9306/agent-skills` tree and optionally enriches descriptions from that repository's README.
- Both surfaces require explicit loading, error, retry, and upstream-link states.
- Anonymous GitHub API availability and rate limits are accepted runtime dependencies; failure must not break the rest of the document page.
- Private or locally installed Skills remain out of scope.


## Timeline

- time: 2026-08-26T17:01:23
  kind: decision
  summary: "Created this page: 在浏览器运行时读取公开 Agent 配置源"
  source: "User requirement 2026-08-26; ISSUE-0003; docs/.vitepress/theme/RemoteAgents.vue; docs/.vitepress/theme/RemoteSkills.vue"
  affects: [runtime-github-agent-sources]

- time: 2026-08-26T17:01:36
  kind: decision
  summary: Record runtime GitHub source architecture for AGENTS.md and public Skills pages
  source: "User requirement 2026-08-26; ISSUE-0003"
  affects: [runtime-github-agent-sources]
