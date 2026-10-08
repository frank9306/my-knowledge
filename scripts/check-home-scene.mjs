import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const [landing, timeline, css, config] = await Promise.all([
  readFile(new URL('../docs/.vitepress/theme/HomeLanding.vue', import.meta.url), 'utf8'),
  readFile(new URL('../docs/.vitepress/theme/HomeTimeline.vue', import.meta.url), 'utf8'),
  readFile(new URL('../docs/.vitepress/theme/custom.css', import.meta.url), 'utf8'),
  readFile(new URL('../docs/.vitepress/config.ts', import.meta.url), 'utf8')
])

assert.match(landing, /<main class="knowledge-atlas"/, 'The homepage must expose the Knowledge Atlas surface.')
assert.match(landing, /data-fidelity="canvas"/, 'The homepage canvas must expose a stable visual baseline anchor.')
assert.match(landing, /<HomeTimeline\s*\/>/, 'The homepage must render the article discovery experience.')
assert.doesNotMatch(landing, /CrtHead|CRT-404|knowledge-home__figure/, 'The retired CRT archivist must not render.')

assert.match(timeline, /把零散经验，(?:<br>)?组织成可复用的系统。/, 'The approved positioning headline must render verbatim.')
assert.match(timeline, /这里记录 AI Agent、自动化与前端工程中，真正解决过问题的方法。/, 'The approved supporting copy must render verbatim.')
assert.match(timeline, /class="atlas-map"/, 'The homepage must expose the topic map as its signature element.')
assert.match(timeline, /aria-label="知识主题地图"/, 'The topic map must have an accessible name.')
assert.match(timeline, /AI Agent/, 'The topic map must include AI Agent.')
assert.match(timeline, /Python 自动化/, 'The topic map must include Python automation.')
assert.match(timeline, /RPA \/ Playwright/, 'The topic map must include RPA and Playwright.')
assert.match(timeline, /Web \/ React/, 'The topic map must include Web and React.')
assert.match(timeline, /v-model="query"/, 'The homepage must retain inline article search.')
assert.match(timeline, /aria-live="polite"/, 'Filtered article counts must be announced politely.')
assert.match(timeline, /data-fidelity="headline"/, 'The hero headline must expose a stable visual baseline anchor.')
assert.match(timeline, /data-fidelity="map"/, 'The topic map must expose a stable visual baseline anchor.')

assert.match(css, /--atlas-canvas:\s*#0b1020/, 'The design system must define the ink-navy atlas canvas.')
assert.match(css, /--atlas-accent:\s*#5d7cff/, 'The design system must define the approved cobalt accent.')
assert.match(css, /\.atlas-hero\s*\{[^}]*grid-template-columns:/s, 'The desktop hero must use a two-column grid.')
assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*\.atlas-hero\s*\{[^}]*grid-template-columns:\s*1fr/s, 'The knowledge map must collapse to one column on mobile.')
assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/, 'The theme must provide a reduced-motion path.')

for (const label of ['知识地图', '工具收藏', 'AI 协作系统']) {
  assert.match(config, new RegExp(`text: '${label}'`), `The primary navigation must include ${label}.`)
}

console.log('Knowledge Atlas homepage check passed.')
