# 🚀 部署指南

## 📋 自动化部署流程

### 方式一：Git Push 自动部署（推荐）

```bash
# 1. 本地开发
git checkout -b feature/xxx
# ... 开发 ...
git commit -m "feat: 添加新功能"

# 2. 推送到 main 分支（自动触发部署）
git checkout main
git merge feature/xxx
git push origin main
```

**自动流程**：
1. ✅ GitHub Actions 触发 CI 工作流
2. ✅ 代码检查和构建
3. ✅ SSH 部署到阿里云
4. ✅ 自动备份旧版本
5. ✅ 健康检查
6. ✅ 飞书通知部署结果

---

### 方式二：手动触发部署

1. 访问 GitHub 仓库 → **Actions** 标签
2. 选择 **CD - 自动部署到阿里云**
3. 点击 **Run workflow**
4. 选择环境（production/staging）
5. 点击 **Run workflow** 按钮

---

### 方式三：服务器手动部署

```bash
# SSH 登录服务器
ssh root@8.163.68.155

# 执行部署脚本
/var/www/deploy.sh
```

---

## 🔄 回滚操作

### 方式一：GitHub 回滚

1. 访问 GitHub → **Actions** → 选择之前的成功部署
2. 点击 **Re-run jobs**

### 方式二：服务器脚本回滚

```bash
# SSH 登录服务器
ssh root@8.163.68.155

# 执行回滚脚本
/var/www/rollback.sh
```

---

## 📦 版本发布

### 自动版本号

```bash
# 根据提交信息自动判断版本类型
node scripts/bump-version.js

# 或手动指定版本类型
node scripts/bump-version.js major  # 大版本
node scripts/bump-version.js minor  # 小版本
node scripts/bump-version.js patch  # 补丁版本
```

### 手动创建版本

```bash
# 创建 Git Tag
git tag v1.2.3
git push origin v1.2.3

# 自动触发 Release 工作流，创建 GitHub Release
```

---

## 🔐 GitHub Secrets 配置

在 GitHub 仓库 **Settings → Secrets and variables → Actions** 中添加：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `ALIYUN_SSH_KEY` | SSH 私钥内容 | 阿里云服务器 SSH 私钥 |
| `ALIYUN_HOST` | `8.163.68.155` | 阿里云服务器 IP |
| `ALIYUN_USER` | `root` | 服务器用户名 |
| `FEISHU_WEBHOOK_URL` | 飞书机器人 URL | 部署通知 Webhook |

---

## 📊 健康检查

```bash
# 手动检查服务状态
curl -I https://qiansuiai.cn

# 或使用健康检查脚本
/var/www/health-check.sh
```

---

## 📝 日志查看

```bash
# 部署日志
tail -f /var/log/qiansuiai-deploy.log

# Nginx 访问日志
tail -f /var/log/nginx/access.log

# Nginx 错误日志
tail -f /var/log/nginx/error.log

# GitHub Actions 日志
# GitHub → Actions → 选择运行记录 → 查看日志
```

---

## 🆘 故障排查

### 部署失败

1. **查看 GitHub Actions 日志**
   - GitHub → Actions → 失败的部署 → 查看详细日志

2. **查看服务器日志**
   ```bash
   ssh root@8.163.68.155
   tail -f /var/log/qiansuiai-deploy.log
   ```

3. **检查 Nginx 状态**
   ```bash
   systemctl status nginx
   ```

### 健康检查失败

1. **检查服务是否运行**
   ```bash
   systemctl status nginx
   ```

2. **检查端口占用**
   ```bash
   netstat -tlnp | grep :80
   ```

3. **手动测试访问**
   ```bash
   curl -I http://localhost
   ```

---

## ✅ 验收清单

- [ ] GitHub Actions 工作流正常运行
- [ ] 自动部署成功
- [ ] 自动备份功能正常
- [ ] 健康检查通过
- [ ] 飞书通知接收正常
- [ ] 回滚脚本测试通过
- [ ] 版本发布流程验证

---

**文档更新时间**: 2026-04-05  
**网站**: https://qiansuiai.cn
