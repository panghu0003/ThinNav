<template>
  <div class="app-content">
    <div class="content-wrapper">
      <div v-for="(category, index) in categories" 
           :key="category.id" 
           class="category fade-in" 
           :style="{ animationDelay: `${0.3 + index * 0.1}s` }">
        <p :id="`category-${category.id}`" class="category-name text-h3">{{ category.name }}</p>
        <div class="card-container">
          <WebsiteCard
            v-for="(website, wIndex) in category.websites"
            :key="website.id"
            class="card"
            :link="website"
            :style="{ animationDelay: `${0.3 + index * 0.1 + wIndex * 0.05}s` }"
          />
        </div>
      </div>
    </div>
    <div class="footer fade-in" style="animation-delay: 0.8s;">
      <a
        href="https://github.com/DemoJ/ThinNav"
        target="_blank"
        class="footer-link text-caption"
      >
        <i class="fab fa-github"></i> Created by Diyun and ChatGPT
      </a>
    </div>
  </div>
</template>

<script>
import WebsiteCard from "./WebsiteCard.vue";

export default {
  name: "AppContent",
  components: {
    WebsiteCard,
  },
  props: {
    categories: Array,
  },
};
</script>

<style scoped>
.app-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* 100vh - header高度 - header上间距 - container上下margin - footer预留 */
  min-height: calc(100vh - var(--header-height) - var(--header-margin-top) - 40px - 60px);
  position: relative;
  padding-bottom: 60px;
}

.content-wrapper {
  flex-grow: 1; /* 占据剩余的垂直空间，确保footer在底部 */
}

.category {
  margin-bottom: var(--spacing-10);
  opacity: 0;
  animation-fill-mode: forwards;
}

/* hover 卡片所在分类提升层级，避免 tooltip 被后续分类遮挡 */
.category:has(.website-card:hover) {
  z-index: 20;
  position: relative;
}

@media (max-width: 768px) {
  .app-content {
    /* 移动端 container margin 是 12px，重新计算 min-height */
    min-height: calc(100vh - var(--header-height) - var(--header-margin-top) - 24px - 60px);
  }

  .category {
    margin-bottom: var(--spacing-8);
  }

  .card-container {
    gap: var(--spacing-3);
  }
}

.category-name:hover::after {
  transform: scaleX(1) translateX(-50%);
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: var(--spacing-5);
}

.category-name {
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--text-color-primary);
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  scroll-margin-top: var(--spacing-5);
  cursor: default;
}

@media (max-width: 768px) {
  .category-name {
    /* 移动端 sidebar 为顶部 sticky 横条（约 46px 高 + 12px 间距） */
    scroll-margin-top: 58px;
  }
}

.category-name::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--color-brand) 30%,
    var(--color-brand-hover) 50%,
    var(--color-brand) 70%,
    transparent 100%
  );
  opacity: 0.85;
  transform: scaleX(0) translateX(-50%);
  transform-origin: center;
  transition: transform var(--duration-slow) var(--ease-emphasized);
}

/* 版权信息样式 */
.footer {
  text-align: center;
  padding: 10px 0;
  width: 100%;
  position: absolute; /* 使用绝对定位 */
  bottom: 20px; /* 距离底部固定20px */
  left: 0;
  /* 设置最小高度，确保 footer 在内容为空时仍然可见 */
  min-height: 40px;
  /* 可选：确保 footer 有垂直空间，即使内容为空 */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0; /* 初始状态为不可见 */
  animation-fill-mode: forwards; /* 保持动画结束后的状态 */
}

.footer-link {
  color: var(--text-color-tertiary);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--duration-normal) var(--ease-standard);
}

.footer-link i {
  margin-right: var(--spacing-2);
  font-size: 16px;
}

.footer-link:hover {
  color: var(--color-brand);
}
</style>
