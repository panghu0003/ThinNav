<template>
  <div class="website-card zoom-in" @click="navigateToUrl(link.url)">
    <div class="website-icon">
      <img
        v-if="!iconFailed && link.icon_url"
        :src="link.icon_url"
        alt="icon"
        @error="iconFailed = true"
      />
      <span v-else class="icon-fallback">{{ fallbackText }}</span>
    </div>
    <div class="website-info">
      <p class="website-name text-body">{{ link.name }}</p>
      <p class="website-description text-body-sm">{{ link.description }}</p>
    </div>
    <div class="tooltip text-body-sm" role="tooltip">{{ link.description }}</div>
  </div>
</template>

<script>
export default {
  name: 'WebsiteCard',
  props: {
    link: Object
  },
  data() {
    return {
      iconFailed: false
    };
  },
  computed: {
    fallbackText() {
      const name = this.link && this.link.name ? this.link.name.trim() : '';
      return name ? name.charAt(0).toUpperCase() : '?';
    }
  },
  methods: {
    navigateToUrl(url) {
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped>
.website-card {
  width: 300px;
  max-width: 100%;
  min-height: 88px;
  opacity: 0;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-5);
  cursor: pointer;
  position: relative;
  animation-fill-mode: forwards;
  transition: transform var(--duration-normal) var(--ease-standard),
              box-shadow var(--duration-normal) var(--ease-standard),
              border-color var(--duration-normal) var(--ease-standard);
}

.website-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-brand-border);
  z-index: 20;
}

.website-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  transition: transform var(--duration-normal) var(--ease-standard);
}

.website-card:hover .website-icon {
  transform: scale(1.08);
}

.website-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: var(--radius-sm);
}

.icon-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-sm);
  background: var(--color-brand-light);
  color: var(--color-brand);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  user-select: none;
}

.website-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  flex: 1;
}

.website-name {
  margin: 0 0 6px 0;
  color: var(--text-color-primary);
}

.website-description {
  margin: 0;
  color: var(--text-color-secondary);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3em;
  line-height: var(--line-height-normal);
}

/* 纯 CSS tooltip：默认在卡片上方，卡片靠近顶部时自动翻到下方 */
.tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background-color: var(--tooltip-bg);
  color: var(--tooltip-color);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  width: max-content;
  max-width: 260px;
  white-space: normal;
  word-break: break-word;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  line-height: var(--line-height-normal);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-standard),
              visibility var(--duration-fast);
  z-index: 10;
}

.tooltip::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--tooltip-bg);
}

.website-card:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* 前两行卡片靠近视口顶部时，tooltip 翻到下方 */
.category:first-child .website-card .tooltip {
  bottom: auto;
  top: calc(100% + 10px);
  transform: translateX(-50%) translateY(-4px);
}

.category:first-child .website-card .tooltip::before {
  top: auto;
  bottom: 100%;
  border-top-color: transparent;
  border-bottom-color: var(--tooltip-bg);
}

.category:first-child .website-card:hover .tooltip {
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 768px) {
  .website-card {
    width: 100%;
  }

  .tooltip {
    max-width: calc(100vw - 64px);
  }
}
</style>
