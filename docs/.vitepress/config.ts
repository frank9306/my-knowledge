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
  title: 'Frank 的书房',
  description: 'AI、代码与自动化笔记。',
  lang: 'zh-CN',
  appearance: { initialValue: 'light' },
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
    const socialTitle = title || 'Frank 的书房'
    const socialDescription = description || 'AI、代码与自动化笔记。'

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ['meta', { property: 'og:site_name', content: 'Frank 的书房' }],
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
          name: 'Frank 的书房',
          url: siteUrl,
          inLanguage: 'zh-CN'
        })
      ]
    ]
  },
  ignoreDeadLinks: [/^https?:\/\/localhost(:\d+)?/, /^https?:\/\/127\.0\.0\.1(:\d+)?/],
  markdown: {
    html: false,
    config(md) {
      const renderLink = md.renderer.rules.link_open
      md.renderer.rules.link_open = (tokens, index, options, env, self) => {
        const token = tokens[index]
        if (token.attrGet('href')?.startsWith('/books/agentic-llms-zh/')) {
          token.attrSet('target', '_blank')
          token.attrSet('rel', 'noopener noreferrer')
        }
        return renderLink
          ? renderLink(tokens, index, options, env, self)
          : self.renderToken(tokens, index, options)
      }
    }
  },
  themeConfig: {
    rssUrl: `${siteUrl}/rss.xml`,
    logo: '/logo.svg',
    nav: [
      { text: '阅读', link: '/' },
      { text: '专题', link: '/#study-topics' },
      { text: '收藏', link: '/favorites' },
      { text: 'AI 协作', link: '/ai' }
    ],
    sidebar: {},
    socialLinks: [{ icon: 'github', link: 'https://github.com/frank9306' }],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索全站文章' },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除搜索',
            displayDetails: '显示详情',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        },
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
      message: '边学，边记。',
      copyright: 'Copyright © 2025-present Frank'
    }
  },
  head: [
    ['link', { rel: 'stylesheet', href: `${base}site-canvas.css` }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'Frank 的书房 RSS', href: `${siteUrl}/rss.xml` }],
    ['link', { rel: 'icon', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#faf9f6' }],
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
