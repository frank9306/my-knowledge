import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const [component, css] = await Promise.all([
  readFile(new URL('../docs/.vitepress/theme/HomeLanding.vue', import.meta.url), 'utf8'),
  readFile(new URL('../docs/.vitepress/theme/custom.css', import.meta.url), 'utf8')
])

assert.match(
  component,
  /knowledge-landing__scene[\s\S]*knowledge-landing__backdrop[\s\S]*<CrtHead\s*\/>/,
  'The body background and 3D head must share one scene container.'
)

assert.match(
  css,
  /\.knowledge-landing__scene\s*\{[\s\S]*?width:\s*max\(100vw,\s*177\.778vh\)[\s\S]*?height:\s*max\(100vh,\s*56\.25vw\)/,
  'The scene must reproduce a centered 16:9 cover transform.'
)

const headRule = css.match(/\.crt-head\s*\{([^}]+)\}/)?.[1] ?? ''
assert.match(headRule, /position:\s*absolute/, 'The 3D head must be anchored inside the scene.')
assert.doesNotMatch(headRule, /\b(?:right|bottom):|\d(?:vw|vh)/, 'The 3D head must not use viewport-relative offsets.')

console.log('Home scene coordinate-system check passed.')
