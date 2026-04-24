#!/usr/bin/env bash
set -euo pipefail

# 千岁 AI 网站部署脚本
# 用法: bash deploy.sh
# 直接从本地推送到阿里云，不经过 GitHub

SERVER="root@8.163.68.155"
REMOTE="/var/www/qiansuiai.cn/current"
SSH_KEY="$HOME/.ssh/qiansuiai"

echo ">>> 开始部署到阿里云..."

ssh -i "$SSH_KEY" "$SERVER" "find $REMOTE -mindepth 1 -delete"

rsync -avz --delete \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  --exclude='.git' \
  --exclude='.github' \
  --exclude='proxy-server.js' \
  --exclude='proxy.php' \
  --exclude='.claude' \
  --exclude='CLAUDE.md' \
  --exclude='*.md' \
  --exclude='deploy.sh' \
  ./ \
  "$SERVER:$REMOTE/"

STATUS=$(curl -sk -o /dev/null -w "%{http_code}" "https://$SERVER/index.html")
if [ "$STATUS" != "200" ]; then
  echo ">>> 部署失败！服务器返回 HTTP $STATUS"
  exit 1
fi

echo ">>> 部署成功！服务器返回 200 OK"
