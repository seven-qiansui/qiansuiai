#!/bin/bash
set -e

APP_NAME="qiansuiai"
APP_DIR="/var/www/$APP_NAME"
BACKUP_DIR="$APP_DIR/backups"
LOG_FILE="/var/log/$APP_NAME-deploy.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

rollback() {
    log "🔄 开始回滚..."
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR" 2>/dev/null | head -n1)
    if [ -n "$LATEST_BACKUP" ]; then
        rm -rf "$APP_DIR"
        cp -r "$BACKUP_DIR/$LATEST_BACKUP" "$APP_DIR"
        systemctl reload nginx 2>/dev/null || true
        log "✅ 回滚到版本：$LATEST_BACKUP"
    else
        log "⚠️ 无可用备份，回滚失败"
    fi
}

log "=========================================="
log "🚀 开始部署 - $(date)"
log "=========================================="

cd "$APP_DIR" || exit 1

git pull origin main || log "⚠️ Git pull 失败"

BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
if [ -d "$APP_DIR" ]; then
    cp -r "$APP_DIR" "$BACKUP_DIR/$BACKUP_NAME" 2>/dev/null || true
    log "✅ 备份完成：$BACKUP_NAME"
    cd "$BACKUP_DIR" && ls -t | tail -n +4 | xargs -r rm -rf
    log "🧹 已清理旧备份"
fi

npm ci --production 2>/dev/null || log "⚠️ npm install 失败"
npm run build 2>/dev/null || log "⚠️ npm build 失败"

systemctl reload nginx 2>/dev/null || log "⚠️ Nginx 重启失败"

log "=========================================="
log "✅ 部署完成 - $(date)"
log "=========================================="
