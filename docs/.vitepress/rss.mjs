function escapeXml(value) {
  return String(value)
    .replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu, '')
    .replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[char])
}

export function createRssFeed(pages, site, siteUrl) {
  const articles = pages
    .filter(({ url, frontmatter }) =>
      /^\/(?:blog|ai-coding|ai-agent|python-automation|rpa-playwright|web-react)\/.+/.test(url)
      && !url.endsWith('/')
      && frontmatter.title
      && frontmatter.date
      && frontmatter.draft !== true
      && frontmatter.published !== false
      && Number.isFinite(new Date(frontmatter.date).getTime())
    )
    .map(({ url, frontmatter }) => ({
      url: new URL(url, siteUrl).href,
      title: frontmatter.title,
      description: frontmatter.description ?? frontmatter.title,
      date: new Date(frontmatter.date)
    }))
    .sort((a, b) => b.date - a.date || a.url.localeCompare(b.url))

  const items = articles.map((article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(article.url)}</link>
      <guid isPermaLink="true">${escapeXml(article.url)}</guid>
      <pubDate>${article.date.toUTCString()}</pubDate>
      <description>${escapeXml(article.description)}</description>
    </item>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${escapeXml(new URL('/', siteUrl).href)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>${escapeXml(site.lang)}</language>
${articles.length ? `    <lastBuildDate>${articles[0].date.toUTCString()}</lastBuildDate>\n` : ''}    <generator>VitePress</generator>
    <atom:link href="${escapeXml(new URL('/rss.xml', siteUrl).href)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}
