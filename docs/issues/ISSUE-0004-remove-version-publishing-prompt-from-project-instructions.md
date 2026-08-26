---
id: ISSUE-0004
title: "Remove version-publishing prompt from project instructions"
status: done
priority: low
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0004: Remove version-publishing prompt from project instructions

## Problem

The project AGENTS.md contains a version-publishing prompt that causes unnecessary version-related workflow guidance during ordinary commit and push requests.

## Desired outcome

Project instructions no longer contain the version-publishing prompt, while deployment commands and changelog requirements remain intact.

## Acceptance criteria

- [x] Remove the project instruction that introduces a special "publish a new version" commit-and-push workflow.
- [x] Preserve the documented deployment pipeline, build command, and monthly Changelog requirement.
- [x] Verify no version-publishing prompt remains in project instructions.

## Out of scope

- Changing package versions or release artifacts.
- Changing the global instructions maintained in `ai-environment`.

## Decisions

- Ordinary explicit commit and push requests should proceed without a separate project-level version prompt.

## Implementation notes

- Removed only the version-publishing bullet from the root `AGENTS.md` Deployment section.
- Preserved the GitHub Pages workflow, production build command, and monthly Changelog instruction.

## Verification

Focused instruction search, pnpm docs:build, and git diff --check passed.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

Removed the project-level version-publishing prompt while preserving deployment and Changelog requirements.
