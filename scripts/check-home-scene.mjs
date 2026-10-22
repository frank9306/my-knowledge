import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'

const [landing, timeline, css, config, canvas, reader] = await Promise.all([
  readFile(new URL('../docs/.vitepress/theme/HomeLanding.vue', import.meta.url), 'utf8'),
  readFile(new URL('../docs/.vitepress/theme/HomeTimeline.vue', import.meta.url), 'utf8'),
  readFile(new URL('../docs/.vitepress/theme/custom.css', import.meta.url), 'utf8'),
  readFile(new URL('../docs/.vitepress/config.ts', import.meta.url), 'utf8'),
  readFile(new URL('../docs/public/site-canvas.css', import.meta.url), 'utf8'),
  readFile(new URL('../docs/public/books/agentic-llms-zh/reader.css', import.meta.url), 'utf8')
])

assert.match(landing, /<main class="knowledge-study"/, 'The homepage must expose the approved quiet-study surface.')
assert.match(landing, /<HomeTimeline\s*\/>/, 'The homepage must retain article discovery.')
assert.doesNotMatch(landing, /CrtHead|CRT-404/, 'The retired CRT archivist must not render.')
assert.match(timeline, /边学，<br>边记。/, 'The owner-approved short headline must render verbatim.')
assert.match(timeline, /AI、代码与自动化笔记。/, 'The approved concise description must render verbatim.')
assert.doesNotMatch(timeline, /class="atlas-map"/, 'The former topic map must not replace the approved photo hero.')
assert.match(timeline, /aria-label="按主题阅读"/, 'Topic discovery must remain accessible.')
assert.match(timeline, /v-model="query"/, 'The article archive must retain search.')
assert.match(timeline, /aria-live="polite"/, 'Filtered counts must be announced.')
assert.match(timeline, /data-fidelity="headline"/, 'Keep the visual baseline anchor.')
for (const label of ['AI Agent', 'Python 自动化', 'RPA / Playwright', 'Web / React']) {
  assert.ok(timeline.includes(label), `Keep topic ${label}.`)
}
for (const entry of ['/favorites', '/ai', '/llms.txt']) {
  assert.ok((landing + config).includes(entry), `Keep discovery entry ${entry}.`)
}
assert.match(config, /initialValue: 'light'/, 'New visits must use the approved light appearance.')
assert.match(css, /--atlas-accent:\s*#445d46/, 'Keep the approved sage token.')
assert.match(css, /--atlas-canvas:\s*#faf9f6/, 'Keep the approved ivory token.')
assert.match(css, /prefers-reduced-motion/, 'Keep the reduced-motion path.')
assert.match(css, /overflow-x: clip/, 'The root must use clip rather than hidden.')
const image = await stat(new URL('../docs/public/images/quiet-study/desk.webp', import.meta.url))
assert.ok(image.size > 0 && image.size < 250000, 'Serve the optimized local desk asset.')
// The standalone textbook is a separate presentation owner; retain its shared canvas contract.
assert.match(config, /site-canvas\.css/, 'Keep shared canvas loading for existing consumers.')
assert.match(canvas, /--site-canvas-dark-mid:\s*#0b1020/)
assert.ok(reader.startsWith('@import url("../../site-canvas.css");'))
console.log('Quiet-study homepage contract check passed; runtime behavior is checked in quiet-study.browser.mjs.')
