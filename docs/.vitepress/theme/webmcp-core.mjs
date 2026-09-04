const normalizeText = (value) => String(value ?? '').trim().toLocaleLowerCase('zh-CN')

function normalizeArticlePath(value) {
  const raw = String(value ?? '').trim()
  if (!raw.startsWith('/') || raw.startsWith('//')) return undefined

  const pathname = raw.split(/[?#]/, 1)[0]
  return pathname
    .replace(/\/index(?:\.html)?$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/$/, '') || '/'
}

export function searchArticles(articles, query, requestedLimit = 5) {
  const needle = normalizeText(query)
  const limit = Math.min(10, Math.max(1, Number.isFinite(requestedLimit) ? Math.trunc(requestedLimit) : 5))

  return articles
    .map((article) => {
      const title = normalizeText(article.title)
      const description = normalizeText(article.description)
      const category = normalizeText(article.category)
      const matches = !needle || title.includes(needle) || description.includes(needle) || category.includes(needle)
      const score = !needle ? 0 : title.includes(needle) ? 3 : description.includes(needle) ? 2 : 1
      return { article, matches, score }
    })
    .filter(({ matches }) => matches)
    .sort((left, right) => right.score - left.score || new Date(right.article.date).getTime() - new Date(left.article.date).getTime())
    .slice(0, limit)
    .map(({ article }) => article)
}

export function findArticle(articles, requestedUrl) {
  const requestedPath = normalizeArticlePath(requestedUrl)
  if (!requestedPath) return undefined
  return articles.find(({ url }) => normalizeArticlePath(url) === requestedPath)
}

const readOnlyAnnotations = {
  readOnlyHint: true,
  untrustedContentHint: true
}

export function createWebMcpTools(articles, actions) {
  return [
    {
      name: 'search_articles',
      description: 'Search the published articles in Frank’s knowledge base by title, description, or category.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query in Chinese or English.' },
          limit: { type: 'integer', minimum: 1, maximum: 10, default: 5 }
        },
        required: ['query']
      },
      annotations: readOnlyAnnotations,
      execute: ({ query, limit = 5 }) => JSON.stringify({
        query,
        results: searchArticles(articles, query, limit)
      })
    },
    {
      name: 'read_article',
      description: 'Read the main content of a published article from Frank’s knowledge base.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'A relative article URL returned by search_articles.' }
        },
        required: ['url']
      },
      annotations: readOnlyAnnotations,
      execute: async ({ url }, context) => {
        const article = findArticle(articles, url)
        if (!article) return JSON.stringify({ error: 'Article not found in the published catalogue.' })
        return JSON.stringify(await actions.readArticle(article, context))
      }
    },
    {
      name: 'open_article',
      description: 'Open a published article from Frank’s knowledge base in the current browser tab.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'A relative article URL returned by search_articles.' }
        },
        required: ['url']
      },
      annotations: readOnlyAnnotations,
      execute: ({ url }) => {
        const article = findArticle(articles, url)
        if (!article) return JSON.stringify({ error: 'Article not found in the published catalogue.' })
        return JSON.stringify({ status: actions.openArticle(article), title: article.title, url: article.url })
      }
    }
  ]
}
