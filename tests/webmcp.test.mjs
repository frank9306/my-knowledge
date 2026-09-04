import test from 'node:test'
import assert from 'node:assert/strict'

import { createWebMcpTools, findArticle, searchArticles } from '../docs/.vitepress/theme/webmcp-core.mjs'

const articles = [
  {
    title: 'WebMCP 接入实践',
    url: '/blog/webmcp',
    description: '让浏览器 Agent 使用知识站。',
    category: 'AI Agent',
    date: '2026-09-04T00:00:00.000Z'
  },
  {
    title: 'Playwright 自动化',
    url: '/rpa-playwright/automation',
    description: '浏览器自动化实践。',
    category: 'RPA / Playwright',
    date: '2026-08-01T00:00:00.000Z'
  }
]

test('searchArticles returns ranked published articles with a bounded limit', () => {
  assert.deepEqual(searchArticles(articles, '浏览器 Agent', 20), [articles[0]])
  assert.deepEqual(searchArticles(articles, '', 1), [articles[0]])
})

test('findArticle accepts only catalogue URLs and normalizes clean URL variants', () => {
  assert.equal(findArticle(articles, '/blog/webmcp.html?source=agent'), articles[0])
  assert.equal(findArticle(articles, '/docs/issues/ISSUE-0024'), undefined)
  assert.equal(findArticle(articles, 'https://malicious.example/blog/webmcp'), undefined)
})

test('createWebMcpTools exposes only the three read-only knowledge tools', () => {
  const tools = createWebMcpTools(articles, {
    readArticle: async () => ({ title: 'WebMCP 接入实践', content: '正文' }),
    openArticle: () => 'opened'
  })

  assert.deepEqual(tools.map(({ name }) => name), ['search_articles', 'read_article', 'open_article'])
  assert.ok(tools.every(({ annotations }) => annotations.readOnlyHint === true))
  assert.match(tools[0].execute({ query: 'WebMCP', limit: 1 }), /WebMCP 接入实践/)
})
