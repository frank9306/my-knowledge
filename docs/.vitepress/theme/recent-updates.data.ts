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
        version: createHash('sha256').update((src ?? '').replace(/\r\n/g, '\n')).digest('hex').slice(0, 16)
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
})
