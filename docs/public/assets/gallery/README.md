# 图片上传说明

## 📁 图片存放位置

将所有图片文件放入此目录：
```
docs/public/assets/gallery/
```

## 📋 命名规范

格式：`YYYY-MM-DD-HH-MM-描述.png`

示例：
- `2026-03-17-12-36-狸花猫龙虾装.png`
- `2026-03-17-12-38-狸花猫拟人龙虾装.png`
- `2026-03-17-12-40-官网日记封面.png`

## 🛠️ 添加新图片步骤

1. **复制图片到目录**
   ```
   docs/public/assets/gallery/你的图片.png
   ```

2. **编辑 gallery.md**
   在 `<div class="gallery-grid">` 中添加新的 gallery-item：

   ```html
   <div class="gallery-item">
     <div class="gallery-image">
       <img src="/assets/gallery/你的图片.png" alt="描述" loading="lazy" />
     </div>
     <div class="gallery-info">
       <h3>图片标题</h3>
       <p class="gallery-desc">图片描述</p>
       <div class="gallery-meta">
         <span class="meta-item">📅 2026-03-17 12:00</span>
         <span class="meta-item">🎨 类型</span>
         <span class="meta-item">📊 大小</span>
       </div>
     </div>
   </div>
   ```

3. **更新管理面板**
   在 `admin-controls` 中添加复选框：
   ```html
   <div class="control-item">
     <label>
       <input type="checkbox" class="select-image" value="你的图片.png" />
       <span>图片标题</span>
     </label>
   </div>
   ```

4. **更新导出清单**
   在 `exportList()` 函数的 images 数组中添加新图片信息。

5. **提交并推送**
   ```bash
   git add -A
   git commit -m "feat: 添加新图片 - 描述"
   git push
   ```

## 🗑️ 删除图片

### 方式 1：手动删除
1. 从 `docs/public/assets/gallery/` 删除图片文件
2. 从 `gallery.md` 删除对应的 gallery-item
3. 从管理面板删除复选框
4. 从导出清单删除条目
5. 提交推送

### 方式 2：使用管理功能（待开发）
- 前端已实现选择功能
- 需对接后端 API 实现自动删除

## 📊 图片规格建议

| 用途 | 推荐尺寸 | 格式 | 大小限制 |
|------|----------|------|----------|
| 展示图 | 1200x800 | PNG/JPG | <2MB |
| 封面图 | 1920x1080 (16:9) | PNG/JPG | <3MB |
| 缩略图 | 400x300 | JPG | <200KB |

## 🔧 后续优化

- [ ] 对接后端删除 API
- [ ] 批量上传功能
- [ ] 图片分类标签
- [ ] 搜索过滤功能
- [ ] lightbox 大图预览
