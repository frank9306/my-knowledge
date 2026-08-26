import test from 'node:test'
import assert from 'node:assert/strict'

import {
  classifyFavoriteResource,
  filterFavorites,
  filterTimeline,
  shouldFocusArchiveSearch,
  visibleTimelineItems
} from '../docs/.vitepress/theme/archive-state.mjs'

const articles = [
  { title: '旧文章', category: 'Web / React', date: '2026-01-01T00:00:00.000Z' },
  { title: 'Agent 新文章', category: 'AI 与 Agent', date: '2026-03-01T00:00:00.000Z' },
  { title: 'Python 中篇文章', category: '自动化', date: '2026-02-01T00:00:00.000Z' }
]

test('timeline search keeps update order and pagination grows in twelve-item slices', () => {
  assert.deepEqual(filterTimeline(articles, '文章').map(({ title }) => title), ['Agent 新文章', 'Python 中篇文章', '旧文章'])
  assert.equal(visibleTimelineItems(Array.from({ length: 30 }, (_, index) => index), 1).length, 12)
  assert.equal(visibleTimelineItems(Array.from({ length: 30 }, (_, index) => index), 2).length, 24)
})

test('resource classification populates the automation purpose', () => {
  assert.equal(classifyFavoriteResource({ id: 'office-cli', category: 'ai-agent' }), 'automation')
  assert.equal(classifyFavoriteResource({ id: 'prompt-guide', category: 'learning' }), 'learning')
})

test('slash focuses search only when the user is not already editing text', () => {
  assert.equal(shouldFocusArchiveSearch({ key: '/', tagName: 'BODY', editable: false }), true)
  assert.equal(shouldFocusArchiveSearch({ key: '/', tagName: 'INPUT', editable: false }), false)
})

test('favorites combine keyword, type, and purpose filters', () => {
  const favorites = [
    { title: 'Agent 工具', summary: '编码助手', type: 'resource', category: 'ai-agent' },
    { title: '自动化好文', summary: 'Playwright 实践', type: 'article', category: 'automation' }
  ]

  assert.deepEqual(filterFavorites(favorites, { query: '实践', type: 'article', category: 'automation' }), [favorites[1]])
  assert.deepEqual(filterFavorites(favorites, { query: '', type: 'all', category: 'ai-agent' }), [favorites[0]])
})
