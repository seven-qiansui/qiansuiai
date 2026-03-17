---
title: 图片相册
description: AI 生成的图片作品集
---

# 🖼️ 图片相册

AI 生成的图片作品集，展示千岁团队的创意成果。

---

## 📸 作品展示

<div class="gallery-grid">

<div class="gallery-item">
  <div class="gallery-image">
    <div class="gallery-placeholder">🖼️<br/>图片待上传</div>
  </div>
  <div class="gallery-info">
    <h3>狸花猫龙虾装</h3>
    <p class="gallery-desc">可爱狸花猫穿着红色龙虾服装，萌趣十足</p>
    <div class="gallery-meta">
      <span class="meta-item">📅 2026-03-17 12:36</span>
      <span class="meta-item">🎨 原版</span>
      <span class="meta-item">📊 1K</span>
    </div>
  </div>
</div>

<div class="gallery-item">
  <div class="gallery-image">
    <div class="gallery-placeholder">🖼️<br/>图片待上传</div>
  </div>
  <div class="gallery-info">
    <h3>狸花猫拟人龙虾装</h3>
    <p class="gallery-desc">拟人化狸花猫，身穿龙虾主题服装，创意十足</p>
    <div class="gallery-meta">
      <span class="meta-item">📅 2026-03-17 12:38</span>
      <span class="meta-item">🎨 拟人化</span>
      <span class="meta-item">📊 2K</span>
    </div>
  </div>
</div>

<div class="gallery-item">
  <div class="gallery-image">
    <div class="gallery-placeholder">🖼️<br/>图片待上传</div>
  </div>
  <div class="gallery-info">
    <h3>官网日记封面</h3>
    <p class="gallery-desc">运营日记封面图，16:9 宽屏比例</p>
    <div class="gallery-meta">
      <span class="meta-item">📅 2026-03-17 12:40</span>
      <span class="meta-item">🎨 16:9</span>
      <span class="meta-item">📊 2K</span>
    </div>
  </div>
</div>

</div>

---

## 🛠️ 管理功能

<div class="admin-panel">

### 图片管理

<div class="admin-controls">
  <div class="control-item">
    <label>
      <input type="checkbox" class="select-image" value="2026-03-17-12-36-狸花猫龙虾装.png" />
      <span>狸花猫龙虾装</span>
    </label>
  </div>
  <div class="control-item">
    <label>
      <input type="checkbox" class="select-image" value="2026-03-17-12-38-狸花猫拟人龙虾装.png" />
      <span>狸花猫拟人龙虾装</span>
    </label>
  </div>
  <div class="control-item">
    <label>
      <input type="checkbox" class="select-image" value="2026-03-17-12-40-官网日记封面.png" />
      <span>官网日记封面</span>
    </label>
  </div>
</div>

<div class="admin-actions">
  <button class="action-btn delete-btn" onclick="deleteSelected()">
    🗑️ 删除选中图片
  </button>
  <button class="action-btn export-btn" onclick="exportList()">
    📥 导出清单
  </button>
</div>

<div id="admin-message" class="admin-message"></div>

</div>

---

<style>
/* 相册网格布局 */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  padding: 40px 0;
}

.gallery-item {
  background: var(--vp-c-bg-alt);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e5e5e5;
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 122, 255, 0.15);
  border-color: var(--vp-c-brand);
}

.gallery-image {
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-image img,
.gallery-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #86868b;
  text-align: center;
  line-height: 1.6;
}

.gallery-item:hover .gallery-image img,
.gallery-item:hover .gallery-placeholder {
  transform: scale(1.05);
}

.gallery-item:hover .gallery-image img {
  transform: scale(1.05);
}

.gallery-info {
  padding: 24px;
}

.gallery-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text);
  margin: 0 0 12px;
}

.gallery-desc {
  font-size: 0.95rem;
  color: var(--vp-c-text-secondary);
  line-height: 1.6;
  margin: 0 0 16px;
}

.gallery-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
}

.meta-item {
  font-size: 0.8rem;
  color: var(--vp-c-text-secondary);
  background: rgba(0, 122, 255, 0.08);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
}

/* 管理面板 */
.admin-panel {
  background: var(--vp-c-bg-alt);
  border-radius: 16px;
  padding: 32px;
  margin-top: 60px;
  border: 1px solid #e5e5e5;
}

.admin-panel h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text);
  margin: 0 0 24px;
}

.admin-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.control-item label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-item label:hover {
  border-color: var(--vp-c-brand);
  background: rgba(0, 122, 255, 0.02);
}

.control-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.control-item span {
  font-size: 1rem;
  color: var(--vp-c-text);
  font-weight: 500;
}

.admin-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 980px;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-btn {
  background: #ff3b30;
  color: #fff;
}

.delete-btn:hover {
  background: #d63026;
  transform: scale(1.02);
}

.export-btn {
  background: var(--vp-c-brand);
  color: #fff;
}

.export-btn:hover {
  background: var(--vp-c-brand-light);
  transform: scale(1.02);
}

.admin-message {
  margin-top: 20px;
  padding: 16px;
  border-radius: 12px;
  font-weight: 500;
  display: none;
}

.admin-message.success {
  display: block;
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
  border: 1px solid rgba(52, 199, 89, 0.3);
}

.admin-message.error {
  display: block;
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .gallery-image {
    height: 240px;
  }
  
  .admin-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
}

/* 加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gallery-item {
  animation: fadeIn 0.6s ease-out backwards;
}

.gallery-item:nth-child(1) { animation-delay: 0.1s; }
.gallery-item:nth-child(2) { animation-delay: 0.2s; }
.gallery-item:nth-child(3) { animation-delay: 0.3s; }
</style>

<script>
// 删除选中图片功能
function deleteSelected() {
  const checkboxes = document.querySelectorAll('.select-image:checked');
  const messageEl = document.getElementById('admin-message');
  
  if (checkboxes.length === 0) {
    messageEl.textContent = '⚠️ 请先选择要删除的图片';
    messageEl.className = 'admin-message error';
    return;
  }
  
  const selectedFiles = Array.from(checkboxes).map(cb => cb.value);
  
  // TODO: 对接后端删除 API
  console.log('待删除文件:', selectedFiles);
  
  messageEl.textContent = `✅ 已标记 ${checkboxes.length} 张图片待删除（功能开发中，待对接后端 API）`;
  messageEl.className = 'admin-message success';
  
  // 清除选中状态
  checkboxes.forEach(cb => cb.checked = false);
}

// 导出清单功能
function exportList() {
  const images = [
    {
      file: '2026-03-17-12-36-狸花猫龙虾装.png',
      title: '狸花猫龙虾装',
      desc: '可爱狸花猫穿着红色龙虾服装，萌趣十足',
      time: '2026-03-17 12:36',
      type: '原版',
      size: '1K'
    },
    {
      file: '2026-03-17-12-38-狸花猫拟人龙虾装.png',
      title: '狸花猫拟人龙虾装',
      desc: '拟人化狸花猫，身穿龙虾主题服装，创意十足',
      time: '2026-03-17 12:38',
      type: '拟人化',
      size: '2K'
    },
    {
      file: '2026-03-17-12-40-官网日记封面.png',
      title: '官网日记封面',
      desc: '运营日记封面图，16:9 宽屏比例',
      time: '2026-03-17 12:40',
      type: '16:9',
      size: '2K'
    }
  ];
  
  const csvContent = '文件名，标题，描述，生成时间，类型，大小\n' +
    images.map(img => `"${img.file}","${img.title}","${img.desc}","${img.time}","${img.type}","${img.size}"`).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gallery-list.csv';
  link.click();
  
  const messageEl = document.getElementById('admin-message');
  messageEl.textContent = '✅ 已导出图片清单 (gallery-list.csv)';
  messageEl.className = 'admin-message success';
}
</script>
