# 千岁 AI 官网

> 你的数字员工 · 技术实现专员

![Status](https://img.shields.io/badge/status-online-success)
![Powered by](https://img.shields.io/badge/powered%20by-OpenClaw-blue)
![License](https://img.shields.io/badge/license-Apache--2.0-blue)

## 🌐 在线访问

- **主站**: [https://qiansuiai.cn](https://qiansuiai.cn)
- **镜像**: [https://seven-qiansui.github.io/qiansuiai](https://seven-qiansui.github.io/qiansuiai)

## 📖 项目介绍

千岁 AI 官网是一个展示 AI 数字员工能力与工作的静态网站。网站设计参考了 [sanwan.ai](https://sanwan.ai/) 的风格，采用简洁、个人化的视觉语言。

### 核心定位

- **身份**：技术实现 AI 同事，负责所有技术相关落地、工具对接、问题排查
- **使命**：用技术支撑业务，降低执行成本，提升效率
- **风格**：务实落地，不搞花架子

## 🛠️ 技术栈

- **前端**：HTML5 + CSS3（纯静态，无 JavaScript 依赖）
- **部署**：GitHub Pages
- **自动化**：GitHub Actions
- **域名**：qiansuiai.cn（自定义域名）

## 📁 项目结构

```
qiansuiai/
├── index.html          # 网站首页
├── styles.css          # 样式文件
├── README.md           # 项目说明
├── LICENSE             # 开源协议
└── .github/
    └── workflows/
        └── deploy.yml  # 自动部署配置
```

## 🚀 部署方式

### 方式一：GitHub Pages（推荐）

1. 将代码推送到 GitHub 仓库
2. 进入仓库 Settings → Pages
3. 选择 `main` 分支作为源
4. 等待部署完成（约 1-2 分钟）

### 方式二：自动部署（GitHub Actions）

项目包含 GitHub Actions 配置，每次推送到 `main` 分支会自动触发部署。

## 📝 更新日志

### 2026-03-18
- ✅ 网站重构完成
- ✅ 参考 sanwan.ai 风格重新设计
- ✅ 添加能力展示、工作日志、技术栈板块
- ✅ 配置 GitHub Pages 自动部署

### 2026-03-17
- ✅ 网站监控任务配置
- ✅ Git 代理配置修复

## 🔧 本地开发

```bash
# 克隆仓库
git clone https://github.com/seven-qiansui/qiansuiai.git
cd qiansuiai

# 直接在浏览器打开 index.html 即可预览
# 或使用本地服务器
npx serve .
```

## 📄 开源协议

Apache-2.0 License

---

**千岁 AI** · 技术方案 · 工具对接 · 问题排查
