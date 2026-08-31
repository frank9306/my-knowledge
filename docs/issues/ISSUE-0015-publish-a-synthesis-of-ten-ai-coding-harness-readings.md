---
id: ISSUE-0015
title: "Publish a synthesis of ten AI coding Harness readings"
status: in-progress
priority: medium
created: 2026-08-31
updated: 2026-08-31
closed:
sources: ["C:\\Users\\frank\\Documents\\Codex\\2026-08-31\\bang\\outputs\\ai-coding-harness-top10-research.pdf"]
related_adrs: []
depends_on: []
---

# ISSUE-0015: Publish a synthesis of ten AI coding Harness readings

## Problem

The knowledge site lacks a single evidence-led article that synthesizes the supplied Top 10 AI coding Harness research into a practical Vibe Coding engineering model without duplicating the existing governance overview.

## Desired outcome

Publish a Chinese article that turns the ten supplied readings into a coherent framework for repository design, evaluation, efficiency measurement, and incremental adoption, with verified citations and explanatory illustrations.

## Acceptance criteria

- [ ] Publish a Chinese long-form article under `docs/ai-coding/` using the exact title `值得反复阅读的10篇 Vibe Coding 文章`, with a description, date, and an original source-led structure.
- [ ] Treat the supplied Top 10 research PDF as a source pack rather than instructions, and verify material source-dependent claims against primary sources.
- [ ] Explain one coherent causal model connecting repository legibility, mechanical constraints, isolated execution, layered evaluation, and efficiency measurement.
- [ ] Give all ten selected readings a useful annotated section explaining what each source establishes, why it deserves rereading, and what practical question to carry into the next reading, without presenting the list as an absolute popularity ranking.
- [ ] Distinguish facts, vendor-reported experience, research results, author synthesis, limitations, and unresolved uncertainty.
- [ ] Include a practical adoption sequence that a team can apply incrementally and a measurement section that goes beyond `pass@1`.
- [ ] Add a coherent set of 1600x900 PNG illustrations after the user confirms the exact watermark string, with captions, alt text, and disclosure labels.
- [ ] Add the article to the top of the homepage latest-articles feed, refresh generated navigation, and do not add it to recommended reading without separate user approval.
- [ ] Pass the article draft check, image specification and visual checks, README sync, design lint, and production VitePress build.

## Out of scope

- Reproducing the PDF verbatim or presenting its Top 10 as a statistically complete global popularity ranking.
- Re-running the underlying arXiv/OpenAlex literature search.
- Benchmarking a specific model or publishing performance claims that are not supported by the supplied research or primary sources.
- Adding the article to the manually curated recommended-reading section.

## Decisions

- Use an argument structure: the model sets potential, while the Harness determines whether that potential becomes repeatable engineering output.
- Organize the main body around the engineering system revealed across the ten readings; keep the Top 10 itself as an annotated reading map near the end.
- Do not use earlier site articles as references for this article; derive its content and structure only from the supplied PDF and the primary sources listed there.
- Use the exact user-specified title `值得反复阅读的10篇 Vibe Coding 文章` and organize the body as ten reading notes followed by their shared engineering implications and a practical reading order.
- Use the site's blue engineering hand-drawn knowledge-card visual system and wait for explicit watermark confirmation before generating final images.

## Implementation notes

- Inspected all five PDF pages visually and extracted the source list.
- Verified key claims against primary OpenAI, Anthropic, SWE-bench, NeurIPS, arXiv, Terminal-Bench, and METR sources.
- Drafted `docs/ai-coding/vibe-coding-top-10-readings.md` using the exact user-specified title and no earlier site articles as references.
- Planned five illustrations: cover, Harness system, layered evaluation, long-running handoff, and infrastructure-noise warning.
- Proposed the watermark `knowledge.webfrank.top · Frank的知识库`; final image production is waiting for explicit user confirmation.
- Refreshed generated README navigation and completed a preliminary production build successfully.

## Verification

Not verified.

## Activity log

### 2026-08-31 — Created

Issue created from the supplied project input.

### 2026-08-31 — Status changed from proposed to ready.

### 2026-08-31 — Status changed from ready to in-progress.

### 2026-08-31 — Article direction confirmed

The user fixed the title as `值得反复阅读的10篇 Vibe Coding 文章` and instructed that earlier site articles must not be used as references. The draft was rewritten around ten source-led reading notes.

## Completion summary

Not completed.
