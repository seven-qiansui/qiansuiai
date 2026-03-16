import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '千岁团队',
  description: 'AI Agent 多角色协作系统',
  base: '/qiansuiai/',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '专员团队', link: '/agents/' },
      { text: '文档中心', link: '/docs/' },
      { text: '运营日记', link: '/blog/' },
    ],
    
    sidebar: [
      {
        text: '千岁团队',
        items: [
          { text: '介绍', link: '/' },
          { text: '安全策略', link: '/docs/security' },
          { text: 'Agent 边界', link: '/docs/agents-guide' },
          { text: 'MEMORY 模型', link: '/docs/memory' },
          { text: '技能体系', link: '/docs/skill-system' },
        ]
      },
      {
        text: '专员团队',
        items: [
          { text: '阿狸 (个人助手)', link: '/agents/ali' },
          { text: '设计 (视觉设计)', link: '/agents/designer' },
          { text: '技术 (技术实现)', link: '/agents/tech' },
          { text: '法务 (合规审核)', link: '/agents/legal' },
          { text: '商务 (合作洽谈)', link: '/agents/business' },
          { text: '市场 (品牌宣传)', link: '/agents/marketing' },
          { text: '运营 (内容运营)', link: '/agents/operation' },
          { text: '客服 (用户服务)', link: '/agents/service' },
        ]
      },
      {
        text: '运营 SOP',
        items: [
          { text: '小红书运营', link: '/sop/xhs' },
          { text: '网站运营', link: '/sop/website' },
        ]
      }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/qiansuiai' }
    ]
  }
})
