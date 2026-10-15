<script setup lang="ts">
defineProps<{
  /** 按钮类型：最小化 / 最大化 / 还原 / 关闭 */
  type: 'minimize' | 'maximize' | 'restore' | 'close';
}>();

defineEmits<{
  click: [];
}>();

const titles: Record<string, string> = {
  minimize: '最小化',
  maximize: '最大化',
  restore: '还原',
  close: '关闭',
};
</script>

<template>
  <button
    class="control-button"
    :class="`control-button--${type}`"
    :title="titles[type]"
    @click.stop="$emit('click')"
  >
    <svg width="10" height="10" viewBox="0 0 10 10">
      <!-- 最小化 -->
      <line v-if="type === 'minimize'" x1="0" y1="5" x2="10" y2="5" />
      <!-- 最大化 -->
      <rect v-else-if="type === 'maximize'" x="0.5" y="0.5" width="9" height="9" />
      <!-- 还原 -->
      <template v-else-if="type === 'restore'">
        <rect x="0.5" y="2.5" width="7" height="7" />
        <path d="M2.5 2.5V0.5H9.5V7.5H7.5" />
      </template>
      <!-- 关闭 -->
      <template v-else>
        <line x1="0" y1="0" x2="10" y2="10" />
        <line x1="10" y1="0" x2="0" y2="10" />
      </template>
    </svg>
  </button>
</template>

<style scoped>
.control-button {
  width: 46px;
  height: 100%;
  display: grid;
  place-items: center;
  border: none;
  background: transparent;
  cursor: default;
  color: inherit;
  /* 触屏：禁用双击缩放手势，保证 click 立即响应 */
  touch-action: manipulation;

  svg {
    stroke: currentColor;
    stroke-width: 1;
    fill: none;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
}

.control-button--close:hover {
  background-color: #c42b1c;
  color: #fff;
}
</style>
