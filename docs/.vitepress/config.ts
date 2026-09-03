import { defineConfig } from 'vitepress'

const base = '/'
const siteUrl = 'https://knowledge.webfrank.top'

function pageUrl(page: string) {
  const path = page === 'index.md' ? '' : page.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  return new URL(path, `${siteUrl}/`).href
}

function tokenizeSearchText(text: string) {
  const tokens = text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)

  for (const match of text.matchAll(/[\p{Script=Han}]+/gu)) {
    const value = match[0]

    for (const char of value) {
      tokens.push(char)
    }

    for (let index = 0; index < value.length - 1; index += 1) {
      tokens.push(value.slice(index, index + 2))
    }
  }

  return tokens
}

export default defineConfig({
  title: 'Frank 的知识库',
  description: '技术笔记、自动化实践、AI Agent 学习与个人知识沉淀。',
  lang: 'zh-CN',
  appearance: 'dark',
  base,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: siteUrl
  },
  transformHead({ page, title, description }) {
    const canonicalUrl = pageUrl(page)
    const socialTitle = title || 'Frank 的知识库'
    const socialDescription = description || '技术笔记、自动化实践、AI Agent 学习与个人知识沉淀。'

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ['meta', { property: 'og:site_name', content: 'Frank 的知识库' }],
      ['meta', { property: 'og:title', content: socialTitle }],
      ['meta', { property: 'og:description', content: socialDescription }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:title', content: socialTitle }],
      ['meta', { name: 'twitter:description', content: socialDescription }],
      [
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Frank 的知识库',
          url: siteUrl,
          inLanguage: 'zh-CN'
        })
      ]
    ]
  },
  ignoreDeadLinks: [/^https?:\/\/localhost(:\d+)?/, /^https?:\/\/127\.0\.0\.1(:\d+)?/],
  markdown: {
    html: false
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '我的收藏', link: '/favorites' },
      { text: '我的 AI', link: '/ai' }
    ],
    sidebar: {},
    socialLinks: [{ icon: 'github', link: 'https://github.com/frank9306' }],
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: tokenizeSearchText,
            processTerm: (term) => term.toLowerCase()
          },
          searchOptions: {
            prefix: true,
            fuzzy: 0.2
          }
        }
      }
    },
    footer: {
      message: 'Built with VitePress and GitHub Pages.',
      copyright: 'Copyright © 2025-present Frank'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#111214' }],
    [
      'script',
      {
        defer: '',
        src: 'https://state.webfrank.top/script.js',
        'data-website-id': 'dfe19437-097d-46dd-82d4-9a3cab647b38'
      }
    ]
  ]
})
