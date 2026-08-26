import { createHash } from 'node:crypto'
import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
  includeSrc: true,
  transform(pages) {
    return pages
      .filter(({ frontmatter }) => frontmatter.title && frontmatter.date)
      .map(({ url, src, frontmatter }) => ({
        title: String(frontmatter.title),
        url,
        date: new Date(frontmatter.updated ?? frontmatter.date).toISOString(),
        description: String(frontmatter.description ?? ''),
        category: categoryFromUrl(url),
        version: createHash('sha256').update((src ?? '').replace(/\r\n/g, '\n')).digest('hex').slice(0, 16)
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
})

function categoryFromUrl(url: string) {
  const section = url.split('/').filter(Boolean)[0]
  return ({
    'ai-coding': 'AI 编程工程',
    'ai-agent': 'AI Agent',
    'python-automation': 'Python 自动化',
    'rpa-playwright': 'RPA / Playwright',
    'web-react': 'Web / React',
    blog: '技术随笔'
  } as Record<string, string>)[section] ?? '技术随笔'
}
