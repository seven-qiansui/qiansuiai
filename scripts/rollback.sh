#!/bin/bash
set -e

APP_NAME="qiansuiai"
APP_DIR="/var/www/$APP_NAME"
BACKUP_DIR="$APP_DIR/backups"

echo "📋 可用备份版本："
ls -lt "$BACKUP_DIR" 2>/dev/null | awk '{print NR". "$9" - "$6" "$7" "$8}' || echo "无可用备份"

echo ""
read -p "请选择要回滚的版本编号：" VERSION_NUM

BACKUP_NAME=$(ls -t "$BACKUP_DIR" 2>/dev/null | sed -n "${VERSION_NUM}p")

if [ -z "$BACKUP_NAME" ]; then
    echo "❌ 无效的版本编号或无备份"
    exit 1
fi

echo "🔄 回滚到版本：$BACKUP_NAME"
read -p "确认回滚？(y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ 回滚取消"
    exit 0
fi

rm -rf "$APP_DIR"
cp -r "$BACKUP_DIR/$BACKUP_NAME" "$APP_DIR"
systemctl reload nginx 2>/dev/null || true

echo "✅ 回滚完成！"
