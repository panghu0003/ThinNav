<template>
  <div class="AppSidebar">
    <ul>
      <li v-for="category in categories" :key="category.id"
          class="nav-item"
          :class="{ 'is-active': activeCategory === category.id }"
          @click="navigateTo(category.id, $event)">
        <i :class="`fas fa-${category.icon_url}`" class="icon"></i>
        <span class="text-body-sm font-medium">{{ category.name }}</span>
      </li>
    </ul>
    <div class="sidebar-bottom-spacer"></div>
  </div>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    categories: Array
  },
  data() {
    return {
      activeCategory: null,
      intersectionObserver: null,
      visibleCategories: new Map(),
    }
  },
  beforeUnmount() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  },
  watch: {
    categories: {
      handler() {
        this.$nextTick(() => {
          this.setupIntersectionObserver();
        });
      },
      deep: true
    }
  },
  methods: {
    createRippleEffect(event) {
      // 创建波纹元素
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      // 获取点击位置
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // 设置波纹位置和大小
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // 添加波纹到元素中
      event.currentTarget.appendChild(ripple);
      
      // 动画结束后移除波纹元素
      setTimeout(() => {
        ripple.remove();
      }, 600); // 与CSS动画时长匹配
    },
    navigateTo(categoryId, event) {
      this.createRippleEffect(event);
      this.activeCategory = categoryId;

      const anchorId = `category-${categoryId}`;
      const targetElement = document.getElementById(anchorId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        history.pushState(null, '', `#${anchorId}`);
      }
    },
    setupIntersectionObserver() {
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
      }
      this.visibleCategories.clear();

      const options = {
        root: null,
        // 上半部分 20% 作为"激活区"，下半部分放宽，确保高分类也能命中
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0
      };

      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const id = Number(entry.target.id.replace('category-', ''));
          if (Number.isNaN(id)) return;
          if (entry.isIntersecting) {
            this.visibleCategories.set(id, entry.boundingClientRect.top);
          } else {
            this.visibleCategories.delete(id);
          }
        });

        // 取可见分类中最靠上的一个作为激活项；都不可见时保持原值
        if (this.visibleCategories.size > 0) {
          const topMost = [...this.visibleCategories.entries()]
            .sort((a, b) => a[1] - b[1])[0][0];
          this.activeCategory = topMost;
        }
      }, options);

      this.categories.forEach((category) => {
        const el = document.getElementById(`category-${category.id}`);
        if (el) this.intersectionObserver.observe(el);
      });
    }
  }
};
</script>

<!-- TODO sidebar始终居中显示 -->
<style scoped>
.AppSidebar {
  width: 100%;
  max-width: 200px;
  min-width: 125px;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: var(--spacing-5);
  margin-bottom: var(--spacing-5);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-color) transparent;
  display: flex;
  flex-direction: column;

  height: auto;
  max-height: calc(100vh - 40px);
}

/* 添加底部填充元素样式 */
.sidebar-bottom-spacer {
  height: 20px;
  min-height: 20px;
  width: 100%;
}

/* 对 Webkit 浏览器（如 Chrome、Safari）的自定义滚动条 */
.AppSidebar::-webkit-scrollbar {
  width: 8px; /* 滚动条的宽度 */
}

.AppSidebar::-webkit-scrollbar-track {
  background: transparent; /* 轨道的背景色 */
}

.AppSidebar::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color); /* 更透明的滚动条颜色 */
  border-radius: 8px; /* 滚动条的圆角 */
  transition: background 0.3s ease; /* 平滑过渡效果 */
}

.AppSidebar:hover::-webkit-scrollbar {
  opacity: 1; /* 鼠标悬停时显示滚动条 */
}

.AppSidebar:hover::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color); /* 鼠标悬停时更明显的滚动条颜色 */
}

/* Firefox 滚动条颜色 */
.AppSidebar:hover {
  scrollbar-color: var(--scrollbar-color) transparent; /* 鼠标悬停时滚动条颜色 */
}

.AppSidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.AppSidebar li {
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  padding: 4px 0 4px 16px;
  margin-top: var(--spacing-3);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: background-color var(--duration-normal) var(--ease-standard);
  width: 100%;
}

/* 导航项悬停效果 */
.AppSidebar li.nav-item:hover {
  background-color: var(--color-hover-overlay);
  border-radius: var(--radius-sm);
}

/* 当前分类高亮 */
.AppSidebar li.nav-item.is-active {
  background-color: var(--color-brand-light);
  border-radius: var(--radius-sm);
  position: relative;
}

.AppSidebar li.nav-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--color-brand);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.AppSidebar li.nav-item.is-active .icon,
.AppSidebar li.nav-item.is-active span {
  color: var(--color-brand);
  font-weight: var(--font-weight-semibold);
}

/* 波纹效果 */
.ripple {
  position: absolute;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none; /* 确保波纹不会干扰点击事件 */
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.AppSidebar .icon {
  font-size: 16px;
  width: 16px;
  height: 16px;
  margin-right: var(--spacing-3);
  object-fit: contain;
  transition: color var(--duration-fast) var(--ease-standard);
}

.AppSidebar span {
  text-decoration: none;
  color: var(--text-color-primary);
  cursor: pointer;
  letter-spacing: var(--letter-spacing-normal);
  transition: color var(--duration-fast) var(--ease-standard);
}

.AppSidebar li:hover span {
  color: var(--color-brand);
}

.AppSidebar li:hover .icon {
  color: var(--color-brand);
}

/* 移动端：sidebar 变为顶部横向滚动条 */
@media (max-width: 768px) {
  .AppSidebar {
    max-width: 100%;
    min-width: 0;
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    max-height: none;
    padding: var(--spacing-1) var(--spacing-2);
  }

  .AppSidebar ul {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-1);
    padding: var(--spacing-1) 0;
  }

  .AppSidebar li {
    flex-shrink: 0;
    margin-top: 0;
    padding: 4px var(--spacing-3);
    height: 36px;
    line-height: 36px;
    white-space: nowrap;
  }

  .AppSidebar li.nav-item.is-active::before {
    left: 50%;
    top: auto;
    bottom: 0;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  }

  .sidebar-bottom-spacer {
    display: none;
  }
}
</style>
