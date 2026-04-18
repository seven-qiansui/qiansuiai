# 千岁 AI 官网

> AI 驱动的内容生产力 — 电商视觉 · 社媒运营 · 企业 AI 服务

![Status](https://img.shields.io/badge/status-online-success)
![Domain](https://img.shields.io/badge/domain-www.qiansuiai.cn-blue)

## 🌐 在线访问

- **主站**: [https://www.qiansuiai.cn](https://www.qiansuiai.cn)

## 📖 项目介绍

千岁 AI 官网是展示三大核心业务板块的企业级静态网站：

| 板块 | 说明 |
|------|------|
| 电商视觉 & 视频 | 产品主图、详情页、短视频的 AI 制作与精修 |
| 社媒内容运营 | 微信公众号、小红书等内容撰写与全平台运维 |
| 企业 AI 服务 | AI 工具选型、工作流自动化、员工培训 |

## 🛠️ 技术栈

- **前端**: HTML5 + CSS3 + 原生 JavaScript（零依赖）
- **部署**: 阿里云服务器 (Nginx)
- **CI/CD**: Git push 后手动部署或由 OpenClaw 自动运维

## 📁 项目结构

```
qiansuiai/
├── index.html          # 首页 (SPA)
├── cases.html          # 案例展示页
├── css/
│   └── style.css       # 全部样式
├── js/
│   └── main.js         # 交互脚本
├── images/             # 案例缩略图
├── data/
│   └── cases.json      # 案例数据
├── wechat-qr.jpg       # 微信二维码
├── wechat-official.jpg # 公众号二维码
├── robots.txt          # SEO 配置
└── sitemap.xml         # 站点地图
```

## 🔧 本地开发

```bash
# 克隆仓库
git clone https://github.com/seven-qiansui/qiansuiai.git
cd qiansuiai

# 直接在浏览器打开 index.html 即可预览
```

## 🚀 部署

将文件上传至阿里云服务器的 Nginx 根目录即可。OpenClaw 可通过 git pull 自动更新。

---

**千岁 AI** · www.qiansuiai.cn
