import { createWebMcpTools } from './webmcp-core.mjs'

async function readArticle(article, context) {
  const response = await fetch(article.url, {
    credentials: 'same-origin',
    signal: context?.signal
  })

  if (!response.ok) throw new Error(`Unable to read article (${response.status}).`)

  const html = await response.text()
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const content = parsed.querySelector('.VPDoc .vp-doc, main .vp-doc')
  content?.querySelectorAll('script, style, button, nav').forEach((element) => element.remove())

  return {
    title: article.title,
    url: new URL(article.url, window.location.origin).href,
    description: article.description,
    category: article.category,
    updated: article.date,
    content: content?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
  }
}

function openArticle(article) {
  window.location.assign(article.url)
  return 'opening'
}

export async function registerWebMcpTools(articles) {
  if (typeof document === 'undefined' || !document.modelContext?.registerTool) return () => {}

  const controller = new AbortController()
  const tools = createWebMcpTools(articles, { readArticle, openArticle })

  try {
    for (const tool of tools) {
      await document.modelContext.registerTool(tool, { signal: controller.signal })
    }
  } catch (error) {
    controller.abort()
    console.warn('[WebMCP] Tool registration failed.', error)
  }

  return () => controller.abort()
}
