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

