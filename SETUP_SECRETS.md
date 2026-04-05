# 🔐 GitHub Secrets 一键配置指南

**仓库**: seven-qiansui/qiansuiai  
**配置页面**: https://github.com/seven-qiansui/qiansuiai/settings/secrets/actions

---

## 📋 需要配置的 Secrets

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `ALIYUN_SSH_KEY` | (见下方) | SSH 私钥 |
| `ALIYUN_HOST` | `8.163.68.155` | 服务器 IP |
| `ALIYUN_USER` | `root` | 服务器用户 |
| `FEISHU_WEBHOOK_URL` | (可选) | 飞书通知 |

---

## 🚀 快速配置（3 步完成）

### 步骤 1：获取 SSH 私钥

**PowerShell 命令**（复制粘贴）：
```powershell
Get-Content C:\Users\SEVEN\.ssh\id_ed25519 -Raw
```

**输出示例**（复制全部内容）：
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBxxxxxx...（省略）...
-----END OPENSSH PRIVATE KEY-----
```

---

### 步骤 2：打开 Secrets 配置页面

**直接访问**：
```
https://github.com/seven-qiansui/qiansuiai/settings/secrets/actions
```

---

### 步骤 3：逐个添加 Secrets

#### 3.1 添加 ALIYUN_SSH_KEY

1. 点击 **New repository secret**
2. **Name**: `ALIYUN_SSH_KEY`
3. **Value**: 粘贴步骤 1 获取的 SSH 私钥（完整内容）
4. 点击 **Add secret**

#### 3.2 添加 ALIYUN_HOST

1. 点击 **New repository secret**
2. **Name**: `ALIYUN_HOST`
3. **Value**: `8.163.68.155`
4. 点击 **Add secret**

#### 3.3 添加 ALIYUN_USER

1. 点击 **New repository secret**
2. **Name**: `ALIYUN_USER`
3. **Value**: `root`
4. 点击 **Add secret**

#### 3.4 添加 FEISHU_WEBHOOK_URL（可选）

1. 点击 **New repository secret**
2. **Name**: `FEISHU_WEBHOOK_URL`
3. **Value**: 飞书机器人 Webhook URL
4. 点击 **Add secret**

---

## ✅ 验证配置

配置完成后，访问 Actions 页面查看：
```
https://github.com/seven-qiansui/qiansuiai/actions
```

推送任意代码测试自动部署：
```bash
cd C:\Users\SEVEN\qiansuiai
echo "# 测试部署" >> README.md
git add README.md
git commit -m "test: 触发部署测试"
git push
```

---

## 🔍 故障排查

### 部署失败

1. **检查 Secrets 是否正确**
   - 访问：https://github.com/seven-qiansui/qiansuiai/settings/secrets/actions
   - 确认 4 个 Secrets 都已配置

2. **查看 Actions 日志**
   - 访问：https://github.com/seven-qiansui/qiansuiai/actions
   - 点击失败的运行记录
   - 查看详细错误信息

3. **SSH 连接测试**
   ```bash
   ssh -i C:\Users\SEVEN\.ssh\id_ed25519 root@8.163.68.155 "echo 连接成功"
   ```

---

## 📞 需要帮助？

运行以下命令自动生成配置报告：
```powershell
cd C:\Users\SEVEN\qiansuiai
Get-ChildItem .github/workflows/ | Select-Object Name
Get-ChildItem scripts/ | Select-Object Name
```

---

**配置时间**: 2-3 分钟  
**难度**: ⭐⭐☆☆☆（简单）
