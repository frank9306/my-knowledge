import assert from 'node:assert/strict'
import test from 'node:test'
import { createRssFeed } from '../docs/.vitepress/rss.mjs'

const site = {
  title: 'FRANK / KNOWLEDGE',
  description: '工程知识',
  lang: 'zh-CN'
}
const siteUrl = 'https://knowledge.webfrank.top'

// ContentData fields follow the installed VitePress loader contract.
test('RSS exposes dated articles with stable absolute permalinks in newest-first order', () => {
  const xml = createRssFeed([
    { url: '/blog/older', frontmatter: { title: '旧文章', date: '2026-06-25' } },
    { url: '/ai-coding/newer', frontmatter: { title: '新文章', date: new Date('2026-08-31'), description: '新摘要' } }
  ], site, siteUrl)
  assert.match(xml, /<rss version="2.0"/)
  assert.match(xml, /<title>FRANK \/ KNOWLEDGE<\/title>/)
  assert.match(xml, /<atom:link href="https:\/\/knowledge.webfrank.top\/rss.xml"/)
  assert.ok(xml.indexOf('<title>新文章</title>') < xml.indexOf('<title>旧文章</title>'))
  assert.match(xml, /<guid isPermaLink="true">https:\/\/knowledge.webfrank.top\/ai-coding\/newer<\/guid>/)
  assert.match(xml, /<pubDate>Mon, 31 Aug 2026 00:00:00 GMT<\/pubDate>/)
  assert.match(xml, /<description>新摘要<\/description>/)
})

test('RSS includes only published dated articles and escapes XML text', () => {
  const page = (url, values = {}) => ({ url, frontmatter: { title: '文章', date: '2026-08-31', ...values } })
  const xml = createRssFeed([
    page('/blog/published', { title: 'A & B < C', description: '引号 " 与单引号 \' 和非法字符\u0001' }),
    page('/blog/draft', { draft: true }),
    page('/blog/unpublished', { published: false }),
    page('/blog/no-date', { date: undefined }),
    page('/blog/bad-date', { date: 'invalid' }),
    page('/blog/no-title', { title: undefined }),
    page('/blog/'),
    page('/docs/issues/record'),
    page('/notes/private')
  ], site, siteUrl)
  assert.equal((xml.match(/<item>/g) ?? []).length, 1)
  assert.match(xml, /<title>A &amp; B &lt; C<\/title>/)
  assert.match(xml, /&quot; 与单引号 &apos;/)
  assert.ok(!xml.includes('\u0001'))
  assert.ok(!xml.includes('Invalid Date'))
})
