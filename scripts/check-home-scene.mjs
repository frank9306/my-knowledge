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
assert.match(component, /CRT-404/, 'The homepage character must expose the CRT-404 identity.')
assert.match(component, /knowledge-home__speech/, 'The character must render a speech bubble.')
assert.match(component, /role="status"/, 'The speech bubble must expose status semantics.')
assert.match(component, /aria-live="polite"/, 'The speech bubble must announce dialogue politely.')
for (const dialogueType of ['welcome', 'normal', 'warning', 'roast']) {
  assert.match(component, new RegExp(`${dialogueType}Lines`), `The character must include ${dialogueType} dialogue.`)
}
assert.match(component, /WELCOME_DATE_KEY/, 'The daily welcome must use its own local storage key.')
assert.match(component, /WELCOME_DELAY_MS\s*=\s*600/, 'The welcome must start after a short entrance delay.')
assert.match(component, /CLICK_WINDOW_MS\s*=\s*2000/, 'Rapid clicks must use a two-second window.')
assert.match(component, /WARNING_CLICK_COUNT\s*=\s*4/, 'The fourth rapid click must warn.')
assert.match(component, /ROAST_CLICK_COUNT\s*=\s*7/, 'The seventh rapid click must roast.')
assert.match(component, /CLICK_RESET_MS\s*=\s*3000/, 'A click streak must reset after three seconds.')
assert.match(component, /pet\.value\?\.react\('welcome'\)/, 'The daily welcome must trigger its matching animation.')
assert.match(component, /dragTravel\s*>=\s*6/, 'Dragging must be excluded from the click streak.')
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
for (const reaction of ['welcome', 'warn', 'roast']) {
  assert.match(head, new RegExp(`reaction === '${reaction}'`), `The character must animate the ${reaction} reaction.`)
}
assert.match(head, /if \(reduceMotion\.matches\) \{[\s\S]*characterY = 0[\s\S]*scaleY = 1/, 'Reduced motion must neutralize large body movement.')
assert.match(head, /setClearColor\(0x000000, 0\)/, 'The WebGL scene must render with a transparent background.')

console.log('Draggable 3D homepage character check passed.')
