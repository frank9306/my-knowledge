const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase('zh-CN')

const resourceCategoryMap = {
  'ai-agent': 'ai-agent',
  'ai-prompts': 'ai-agent',
  'network-tools': 'network',
  'proxy-services': 'network',
  'open-systems': 'developer-tools',
  personal: 'developer-tools',
  learning: 'learning',
  information: 'discovery',
  discovery: 'discovery'
}

const resourceCategoryOverrides = {
  'office-cli': 'automation',
  'agent-reach': 'automation',
  vidbee: 'automation'
}

export function classifyFavoriteResource(resource) {
  return resourceCategoryOverrides[resource.id] ?? resourceCategoryMap[resource.category] ?? 'developer-tools'
}

export function shouldFocusArchiveSearch({ key, tagName, editable }) {
  return key === '/' && !editable && !['INPUT', 'TEXTAREA', 'SELECT'].includes(String(tagName).toUpperCase())
}

export function filterTimeline(items, query) {
  const needle = normalize(query)
  return [...items]
    .filter((item) => !needle || normalize(`${item.title} ${item.category} ${item.description ?? ''}`).includes(needle))
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
}

export function visibleTimelineItems(items, page) {
  return items.slice(0, Math.max(1, page) * 12)
}

export function filterFavorites(items, filters) {
  const needle = normalize(filters.query)
  return items.filter((item) => {
    const matchesQuery = !needle || normalize(`${item.title} ${item.summary}`).includes(needle)
    const matchesType = filters.type === 'all' || item.type === filters.type
    const matchesCategory = filters.category === 'all' || item.category === filters.category
    return matchesQuery && matchesType && matchesCategory
  })
}
