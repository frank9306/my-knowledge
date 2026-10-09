import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createContentLoader, defineConfig } from 'vitepress'
import { createRssFeed } from './rss.mjs'

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
  title: 'FRANK / KNOWLEDGE',
  description: '把 AI Agent、自动化与前端工程中的真实经验，组织成可检索、可复用的知识系统。',
  lang: 'zh-CN',
  appearance: 'dark',
  base,
  cleanUrls: true,
  lastUpdated: true,
  async buildEnd(config) {
    const articles = await createContentLoader([
      'blog/**/*.md',
      'ai-coding/**/*.md',
      'ai-agent/**/*.md',
      'python-automation/**/*.md',
      'rpa-playwright/**/*.md',
      'web-react/**/*.md'
    ]).load()
    await writeFile(join(config.outDir, 'rss.xml'), createRssFeed(articles, config.site, siteUrl), 'utf8')
  },
  sitemap: {
    hostname: siteUrl
  },
  transformHead({ page, title, description }) {
    const canonicalUrl = pageUrl(page)
    const socialTitle = title || 'FRANK / KNOWLEDGE'
    const socialDescription = description || '把 AI Agent、自动化与前端工程中的真实经验，组织成可检索、可复用的知识系统。'

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ['meta', { property: 'og:site_name', content: 'FRANK / KNOWLEDGE' }],
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
          name: 'FRANK / KNOWLEDGE',
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
      { text: '知识地图', link: '/' },
      { text: '工具收藏', link: '/favorites' },
      { text: 'AI 协作系统', link: '/ai' },
      { text: 'RSS 订阅', link: '/rss.xml' }
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
      message: '把解决过的问题，沉淀成可以再次调用的方法。',
      copyright: 'Copyright © 2025-present Frank'
    }
  },
  head: [
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'FRANK / KNOWLEDGE RSS', href: `${siteUrl}/rss.xml` }],
    ['link', { rel: 'icon', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#0b1020' }],
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
