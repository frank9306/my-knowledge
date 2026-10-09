import assert from 'node:assert/strict'
import test from 'node:test'
import { copyRssAddress } from '../docs/.vitepress/theme/rss-subscription.mjs'

const address = 'https://knowledge.webfrank.top/rss.xml'

// Clipboard.writeText and umami.track ports follow their official browser/tracker contracts.
test('a successful RSS copy records intent only after the clipboard confirms success', async () => {
  const actions = []
  const clipboard = { async writeText(value) { actions.push(['copy', value]) } }
  const analytics = { track(name) { actions.push(['event', name]) } }
  assert.equal(await copyRssAddress(address, clipboard, analytics), 'copied')
  assert.deepEqual(actions, [['copy', address], ['event', 'rss-copy']])
})

test('denied or unavailable clipboard returns a manual-copy state without recording intent', async () => {
  let events = 0
  const analytics = { track() { events += 1 } }
  assert.equal(await copyRssAddress(address, undefined, analytics), 'manual')
  assert.equal(await copyRssAddress(address, { async writeText() { throw new Error('NotAllowedError') } }, analytics), 'manual')
  assert.equal(events, 0)
})

test('missing, throwing or rejected analytics never changes a successful copy', async () => {
  const clipboard = { async writeText() {} }
  assert.equal(await copyRssAddress(address, clipboard), 'copied')
  assert.equal(await copyRssAddress(address, clipboard, { track() { throw new Error('blocked') } }), 'copied')
  assert.equal(await copyRssAddress(address, clipboard, { track() { return Promise.reject(new Error('offline')) } }), 'copied')
  await new Promise((resolve) => setImmediate(resolve))
})
