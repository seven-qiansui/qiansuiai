import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Qiansui Team',
  description: 'AI Agent Multi-Role Collaboration System',
  base: '/',
  ignoreDeadLinks: true,
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Agents', link: '/agents/' },
      { text: 'Docs', link: '/docs/' },
      { text: 'Blog', link: '/blog/' },
    ],
    
    sidebar: [
      {
        text: 'Qiansui Team',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Security', link: '/docs/security' },
          { text: 'Agent Guide', link: '/docs/agents-guide' },
          { text: 'Memory Model', link: '/docs/memory' },
          { text: 'Skill System', link: '/docs/skill-system' },
        ]
      },
      {
        text: 'Agents',
        items: [
          { text: 'Ali (Assistant)', link: '/agents/ali' },
          { text: 'Designer', link: '/agents/designer' },
          { text: 'Tech', link: '/agents/tech' },
          { text: 'Legal', link: '/agents/legal' },
          { text: 'Business', link: '/agents/business' },
          { text: 'Marketing', link: '/agents/marketing' },
          { text: 'Operation', link: '/agents/operation' },
          { text: 'Service', link: '/agents/service' },
        ]
      },
      {
        text: 'SOP',
        items: [
          { text: 'Xiaohongshu', link: '/sop/xhs' },
          { text: 'Website', link: '/sop/website' },
        ]
      }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/qiansuiai' }
    ]
  }
})
