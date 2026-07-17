import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const [component, head, css] = await Promise.all([
  readFile(new URL('../docs/.vitepress/theme/HomeLanding.vue', import.meta.url), 'utf8'),
  readFile(new URL('../docs/.vitepress/theme/CrtHead.vue', import.meta.url), 'utf8'),
  readFile(new URL('../docs/.vitepress/theme/custom.css', import.meta.url), 'utf8')
])

assert.match(
  component,
  /knowledge-home__figure[\s\S]*<CrtHead(?:\s+[^>]*)?\s*\/>/,
  'The draggable figure must contain the complete 3D character.'
)
assert.doesNotMatch(component, /knowledge-home__backdrop/, 'The homepage character must not use a backdrop element.')
assert.doesNotMatch(css, /home-hero-body\.png/, 'The homepage character must not use a body background image.')

const figureRule = css.match(/\.knowledge-home__figure\s*\{([^}]+)\}/)?.[1] ?? ''
assert.match(figureRule, /position:\s*fixed/, 'The character must float relative to the viewport.')
assert.match(figureRule, /right:\s*20px/, 'The character must default to the right edge.')
assert.match(figureRule, /bottom:\s*16px/, 'The character must default to the bottom edge.')
assert.doesNotMatch(figureRule, /background(?:-image)?:/, 'The floating character must remain transparent.')

const headRule = css.match(/\.crt-head\s*\{([^}]+)\}/)?.[1] ?? ''
assert.match(headRule, /inset:\s*0/, 'The 3D canvas must fill the draggable figure.')
assert.match(headRule, /width:\s*100%/, 'The 3D canvas must use the full figure width.')
assert.match(headRule, /height:\s*100%/, 'The 3D canvas must use the full figure height.')

assert.match(head, /degToRad\(65\)/, 'Horizontal head rotation must be limited to 65 degrees per side.')
assert.match(head, /head\.rotation\.y \+= \(targetRotationY - head\.rotation\.y\) \* 0\.024/, 'Horizontal head tracking must use the faster response rate.')
for (const bodyPart of ['torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg']) {
  assert.match(head, new RegExp(`const ${bodyPart}\\b`), `The complete 3D character must include ${bodyPart}.`)
}
assert.match(head, /setClearColor\(0x000000, 0\)/, 'The WebGL scene must render with a transparent background.')

console.log('Draggable 3D homepage character check passed.')
