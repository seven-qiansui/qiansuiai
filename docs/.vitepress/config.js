import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '千岁团队',
  description: 'AI Agent 多角色协作系统',
  base: '/',
  ignoreDeadLinks: true,
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/' },
      { text: '相册', link: '/gallery' },
      { text: '日记', link: '/blog/' },
    ],
    
    sidebar: [
      {
        text: '文档',
        items: [
          { text: '安全策略', link: '/docs/security' },
          { text: '技能体系', link: '/docs/skill-system' },
        ]
      }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/stevening9789-jpg/qiansuiai' }
    ]
  }
})
