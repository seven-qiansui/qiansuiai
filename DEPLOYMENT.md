# 部署指南

## 部署方式

### 阿里云服务器

1. SSH 登录服务器
2. 进入 Nginx 网站根目录
3. 拉取最新代码或上传文件

```bash
cd /var/www/qiansuiai
git pull origin main
```

### 手动上传

直接将以下文件上传至 Nginx 根目录：
- `index.html`
- `cases.html`
- `css/`
- `js/`
- `images/`
- `data/`
- `wechat-qr.jpg`
- `wechat-official.jpg`
- `robots.txt`
- `sitemap.xml`

## Nginx 配置参考

```nginx
server {
    listen 80;
    server_name www.qiansuiai.cn qiansuiai.cn;
    root /var/www/qiansuiai;
    index index.html;

    # HTTPS 重定向
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.qiansuiai.cn qiansuiai.cn;
    root /var/www/qiansuiai;
    index index.html;

    ssl_certificate     /etc/nginx/ssl/qiansuiai.crt;
    ssl_certificate_key /etc/nginx/ssl/qiansuiai.key;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 更新内容

每次修改文件后，只需重新上传对应文件即可。纯静态站无需重启 Nginx。

---

**网站**: https://www.qiansuiai.cn
