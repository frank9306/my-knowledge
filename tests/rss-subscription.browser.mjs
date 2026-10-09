import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// Run after docs:build, passing an existing Playwright module and browser executable.
const { chromium } = await import(pathToFileURL(path.resolve(process.argv[2])).href)
const root = path.resolve('docs/.vitepress/dist')
const address = 'https://knowledge.webfrank.top/rss.xml'
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    let file = path.resolve(root, '.' + decodeURIComponent(url.pathname))
    if (!file.startsWith(root + path.sep) && file !== root) throw new Error('outside root')
    if (!path.extname(file)) file += '.html'
    if (url.pathname.endsWith('/')) file = path.join(root, '.' + url.pathname, 'index.html')
    const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.xml': 'application/rss+xml' }
    const content = await readFile(file)
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] ?? 'application/octet-stream' })
    res.end(content)
  } catch {
    res.writeHead(404)
    res.end()
  }
})
let browser
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  browser = await chromium.launch({ executablePath: process.argv[3], headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] })
  // No production telemetry or remote source requests during testing.
  await context.route('https://**/*', route => route.abort())
  await context.addInitScript(() => {
    window.__rssEvents = []
    window.umami = { track(name) { window.__rssEvents.push(name) } }
  })
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle' })
  const trigger = page.getByRole('button', { name: 'RSS 订阅', exact: true })
  const input = page.getByLabel('RSS 订阅地址', { exact: true })
  await trigger.click()
  await page.getByRole('button', { name: '复制地址', exact: true }).click()
  await page.getByRole('status').filter({ hasText: '地址已复制' }).waitFor()
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), address)
  assert.deepEqual(await page.evaluate(() => window.__rssEvents), ['rss-copy'])
  await page.keyboard.press('Escape')
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false')
  assert.equal(await trigger.evaluate(el => el === document.activeElement), true)
  await trigger.press('Enter')
  await page.keyboard.press('Tab')
  assert.equal(await input.evaluate(el => el === document.activeElement), true)
  await page.keyboard.press('Tab')
  const copy = page.getByRole('button', { name: '复制地址', exact: true })
  assert.equal(await copy.evaluate(el => el === document.activeElement), true)
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
    configurable: true, value: { writeText: async () => { throw new DOMException('denied', 'NotAllowedError') } }
  }))
  await copy.click()
  await page.getByRole('status').filter({ hasText: '自动复制不可用' }).waitFor()
  assert.deepEqual(await input.evaluate(el => [el === document.activeElement, el.selectionEnd - el.selectionStart]), [true, address.length])
  assert.deepEqual(await page.evaluate(() => window.__rssEvents), ['rss-copy'])
  if (process.argv[4]) await page.screenshot({ path: path.join(process.argv[4], 'rss-copy-desktop.png') })
  await page.setViewportSize({ width: 375, height: 812 })
  if (process.argv[4]) await page.screenshot({ path: path.join(process.argv[4], 'rss-copy-mobile.png') })
  const navigation = await page.locator('.VPNavBar .content-body').boundingBox()
  assert.ok(navigation.x >= 0 && navigation.x + navigation.width <= 375)
  const panel = await page.locator('.rss-subscribe__panel').boundingBox()
  assert.ok(panel.x >= 0 && panel.x + panel.width <= 375)
  const bounds = await trigger.boundingBox()
  assert.ok(bounds.width >= 42 && bounds.height >= 42)
  await page.locator('h1').click()
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false')
  assert.deepEqual(errors, [])
  console.log('PASS: real clipboard success; single intent event; denied-copy recovery; keyboard focus; Escape/outside dismissal; desktop and 375px layout; no runtime errors. Analytics ingestion is simulated.')
} finally {
  await browser?.close()
  await new Promise(resolve => server.close(resolve))
}
