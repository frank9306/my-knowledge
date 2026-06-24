import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Frank 的知识库',
  description: '技术笔记、自动化实践、AI Agent 学习与个人知识沉淀。',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '专题', link: '/topics/' },
      { text: '文章', link: '/blog/' },
      { text: '资源', link: '/resources/' },
      { text: '关于', link: '/about' }
    ],
    sidebar: {
      '/topics/': [
        {
          text: '知识专题',
          items: [
            { text: '专题总览', link: '/topics/' },
            { text: 'AI Agent', link: '/ai-agent/' },
            { text: 'Python 自动化', link: '/python-automation/' },
            { text: 'Web / React', link: '/web-react/' },
            { text: 'RPA / Playwright', link: '/rpa-playwright/' }
          ]
        }
      ],
      '/blog/': [
        {
          text: '文章',
          items: [{ text: '文章索引', link: '/blog/' }]
        }
      ],
      '/resources/': [
        {
          text: '资源',
          items: [{ text: '资源导航', link: '/resources/' }]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/frank9306' }],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Built with VitePress and GitHub Pages.',
      copyright: 'Copyright © 2025-present Frank'
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#8a5a2b' }]
  ]
})
