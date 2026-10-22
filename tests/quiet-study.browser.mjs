import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

// Public-page acceptance checks; supply the installed Playwright module, base URL and output folder.
const { chromium } = await import(pathToFileURL(path.resolve(process.argv[2])).href)
const base = process.argv[3] || 'http://127.0.0.1:5174'
const output = process.argv[4]
if (output) await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE })
function luminance(rgb) {
  const channels = rgb.match(/[\d.]+/g).slice(0, 3).map(value => {
    const channel = Number(value) / 255
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4
  })
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a)
  return (values[0] + .05) / (values[1] + .05)
}
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 }, colorScheme: 'light' })
  await context.route('https://**/*', route => route.abort())
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(base, { waitUntil: 'networkidle' })
  assert.equal((await page.locator('h1').innerText()).replace(/\s/g, ''), '边学，边记。')
  assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), false)
  assert.equal(await page.locator('.study-article').count(), 4)
  assert.ok(await page.locator('.study-hero__photo img').evaluate(el => el.complete && el.naturalWidth > 0))
  const firstArticle = await page.locator('.study-article a').first().getAttribute('href')
  const originalLinks = await page.locator('.study-article a').evaluateAll(items => items.map(item => item.getAttribute('href')))
  for (const width of [1440, 768, 414, 375, 320]) {
    await page.setViewportSize({ width, height: width > 768 ? 1080 : 900 })
    await page.evaluate(() => window.scrollTo(0, 0))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Homepage overflow at ${width}px`)
    for (const selector of ['.study-read', '.study-topics button', '.study-footer__links > a']) {
      for (const item of await page.locator(selector).all()) {
        assert.ok(await item.evaluate(el => el.getBoundingClientRect().height >= 42), `${selector} touch target at ${width}px`)
      }
    }
    if (output) await page.screenshot({ path: path.join(output, `home-${width}.png`), fullPage: true })
  }
  await page.setViewportSize({ width: 1440, height: 1080 })
  await page.getByRole('link', { name: '开始阅读', exact: false }).click()
  assert.equal(new URL(page.url()).hash, '#study-stories')
  await page.getByRole('button', { name: '全部文章', exact: false }).click()
  const search = page.getByRole('searchbox', { name: '搜索文章' })
  await search.fill('xyz-no-matching-article-917')
  await page.getByText('没有找到相关文章。', { exact: true }).waitFor()
  await page.getByRole('button', { name: '清除筛选', exact: true }).click()
  assert.equal(await search.inputValue(), '')
  assert.ok(await page.locator('.study-article').count() > 4)
  const beforeMore = await page.locator('.study-article').count()
  await page.getByRole('button', { name: '更多文章', exact: false }).click()
  assert.ok(await page.locator('.study-article').count() > beforeMore)
  await page.getByRole('button', { name: 'Python 自动化', exact: true }).click()
  assert.equal(await search.inputValue(), 'Python 自动化')
  assert.ok(await page.locator('.study-article').count() > 0)
  assert.equal(await page.getByRole('button', { name: 'Python 自动化', exact: true }).getAttribute('aria-pressed'), 'true')
  await search.fill('Handoff')
  const matching = await page.locator('.study-article').allTextContents()
  assert.ok(matching.length > 0 && matching.every(text => /handoff/i.test(text)))
  await page.getByRole('button', { name: '收起列表', exact: false }).click()
  assert.deepEqual(await page.locator('.study-article a').evaluateAll(items => items.map(item => item.getAttribute('href'))), originalLinks)
  await page.getByRole('button', { name: '全部文章', exact: false }).click()
  assert.equal(await page.locator('.study-article').count(), 12)
  await page.getByRole('button', { name: '收起列表', exact: false }).click()
  await page.locator('h1').click()
  await page.keyboard.press('/')
  assert.equal(await search.evaluate(el => el === document.activeElement), true)
  await page.getByRole('button', { name: '收起列表', exact: false }).click()
  // A real tabbed focus indicator must remain visible.
  await page.keyboard.press('Tab')
  await page.getByRole('link', { name: '开始阅读', exact: false }).focus()
  assert.notEqual(await page.locator('.study-read').evaluate(el => getComputedStyle(el).outlineStyle), 'none')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior), 'auto')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const themeSwitch = page.locator('.VPNavBarAppearance .VPSwitchAppearance')
  await themeSwitch.click()
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), true)
  if (output) await page.screenshot({ path: path.join(output, 'home-dark.png'), fullPage: true })
  for (const theme of ['dark', 'light']) {
    if (theme === 'light') await themeSwitch.click()
    const colors = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      text: getComputedStyle(document.querySelector('h1')).color,
      muted: getComputedStyle(document.querySelector('.study-article time')).color,
      link: getComputedStyle(document.querySelector('.study-read')).color
    }))
    for (const role of ['text', 'muted', 'link']) assert.ok(contrast(colors.background, colors[role]) >= 4.5, `${theme} ${role} contrast`)
    console.log(`${theme} contrast:`, Object.fromEntries(['text', 'muted', 'link'].map(role => [role, contrast(colors.background, colors[role]).toFixed(2)])))
  }
  await page.keyboard.press('Control+k')
  const globalSearch = page.locator('.VPLocalSearchBox input')
  await globalSearch.fill('Handoff')
  await page.locator('.VPLocalSearchBox a').filter({ hasText: 'Handoff' }).first().waitFor()
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 375, height: 900 })
  await page.locator('.VPNavBarHamburger').click()
  await page.locator('.VPNavScreen').getByRole('link', { name: '收藏', exact: true }).click()
  await page.getByRole('searchbox', { name: '搜索工具收藏' }).waitFor()
  // Verify representative real routes and mobile layout after client navigation.
  for (const route of [firstArticle, '/favorites', '/ai']) {
    await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' })
    await page.locator('h1').waitFor()
    if (route === '/favorites') {
      const favoriteSearch = page.getByRole('searchbox', { name: '搜索工具收藏' })
      await favoriteSearch.fill('xyz-no-matching-favorite-917')
      await page.getByText('这组条件下还没有收藏。', { exact: true }).waitFor()
      await favoriteSearch.fill('')
      assert.ok(await page.locator('.favorites-grid li').count() > 0)
      await page.getByRole('button', { name: '参考文章', exact: true }).click()
      assert.equal(await page.getByRole('button', { name: '参考文章', exact: true }).getAttribute('aria-pressed'), 'true')
    }
    for (const width of [1440, 768, 414, 375, 320]) {
      await page.setViewportSize({ width, height: 900 })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} overflow at ${width}px`)
      const navBounds = await page.locator('.VPNavBar .content-body').boundingBox()
      assert.ok(navBounds.x >= 0 && navBounds.x + navBounds.width <= width + 1, `${route} navigation overflows ${width}px: ${JSON.stringify(navBounds)}`)
      if (output && [1440, 375].includes(width)) await page.screenshot({ path: path.join(output, `${route.includes('favorites') ? 'favorites' : route.includes('/ai-agent/') ? 'article' : 'ai'}-${width}.png`) })
    }
  }
  assert.deepEqual(errors, [])
  console.log('PASS: approved homepage, local image, all 5 widths, topics, archive/search/reset/load-more, slash and focus, reduced motion, light/dark, article/favorites/AI routes; no runtime errors.')
} finally {
  await browser.close()
}
