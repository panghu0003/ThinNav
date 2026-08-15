<template>
  <div id="app">
    <transition name="loading-fade">
      <LoadingIndicator v-if="isLoading" :is-loading="isLoading" />
    </transition>
    <div v-if="loadError" class="load-error">
      <i class="fas fa-exclamation-circle load-error-icon"></i>
      <p class="text-body">数据加载失败，请检查网络后重试</p>
      <button type="button" class="load-error-retry" @click="loadData">重新加载</button>
    </div>
    <div class="content-fade-in">
      <div class="header-image fade-in-down"></div>
      <div class="main-container">
        <AppSidebar :categories="categories" class="fade-in-right delay-200" />
        <AppContent :categories="categories" class="fade-in delay-300" />
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from "./components/AppSidebar.vue";
import AppContent from "./components/AppContent.vue";
import LoadingIndicator from "./components/LoadingIndicator.vue";
import { getWebsites, getCategories } from "./api/api";

export default {
  name: "App",
  components: {
    AppSidebar,
    AppContent,
    LoadingIndicator
  },
  data() {
    return {
      categories: [],
      isLoading: true,
      loadError: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      this.loadError = false;
      try {
        const [categoriesResponse, websitesResponse] = await Promise.all([
          getCategories(),
          getWebsites(),
        ]);

        const categories = categoriesResponse;
        const websites = websitesResponse.data;

        if (!Array.isArray(websites)) {
          throw new Error("Websites data is not an array");
        }

        this.categories = categories
          .map((category) => {
            const filteredWebsites = websites
              .filter((website) => website.category_id === category.id)
              .sort((a, b) => a.order - b.order);

            return filteredWebsites.length > 0
              ? {
                  ...category,
                  websites: filteredWebsites,
                }
              : null;
          })
          .filter((category) => category !== null)
          .sort((a, b) => a.order - b.order);

      } catch (error) {
        console.error("Error fetching data:", error);
        this.loadError = true;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style>
html,
body,
#app {
  height: 100%; /* 确保整个页面高度被占用 */
  margin: 0;
  padding: 0;
  width: 100%;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: var(--font-family-sans);
  color: var(--text-color-primary);
}

/* 设置整体背景颜色 */
body {
  background-color: var(--color-background);
}

.main-container {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  margin: var(--spacing-5);
  gap: var(--spacing-14);
}

html {
  scroll-behavior: smooth;
}

.header-image {
  width: calc(100% - 40px);
  height: var(--header-height);
  margin-top: var(--header-margin-top);
  margin-left: auto;
  margin-right: auto;
  background-image: url("@/assets/header.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg);
}

/* 内容淡入效果 */
.content-fade-in {
  opacity: 1;
  transition: opacity 0.5s ease-out;
}

/* 加载遮罩淡出 */
.loading-fade-leave-active {
  transition: opacity var(--duration-slow) var(--ease-standard);
}

.loading-fade-leave-to {
  opacity: 0;
}

/* 加载失败错误态 */
.load-error {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  background: var(--color-background);
  color: var(--text-color-secondary);
}

.load-error-icon {
  font-size: 40px;
  color: var(--text-color-tertiary);
}

.load-error-retry {
  padding: var(--spacing-2) var(--spacing-6);
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-brand);
  color: #fff;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-standard);
}

.load-error-retry:hover {
  background: var(--color-brand-hover);
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .main-container {
    gap: var(--spacing-6);
  }
}

@media (max-width: 768px) {
  :root {
    --header-height: 80px;
    --header-margin-top: var(--spacing-3);
  }

  .main-container {
    flex-direction: column;
    gap: var(--spacing-5);
    margin: var(--spacing-3);
  }

  .header-image {
    width: calc(100% - 24px);
  }
}

/* 其他样式 */
</style>
