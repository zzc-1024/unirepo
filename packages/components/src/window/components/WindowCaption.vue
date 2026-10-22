<script setup lang="ts">
import WindowControlButton from './WindowControlButton.vue';

defineProps<{
  /** 窗口标题 */
  title: string;
  /** 标题图标（资源 URL，可选） */
  icon?: string;
  /** 是否处于最大化状态（决定最大化/还原按钮图标） */
  maximized: boolean;
}>();

defineEmits<{
  minimize: [];
  'toggle-maximize': [];
  close: [];
}>();
</script>

<template>
  <header class="window-caption">
    <div class="window-caption__identity">
      <!-- 自定义图标插槽 -->
      <slot name="icon">
        <img v-if="icon" :src="icon" class="window-caption__icon" alt="" />
      </slot>
      <span class="window-caption__title">{{ title }}</span>
    </div>

    <div class="window-caption__controls">
      <WindowControlButton type="minimize" @click="$emit('minimize')" />
      <WindowControlButton
        :type="maximized ? 'restore' : 'maximize'"
        @click="$emit('toggle-maximize')"
      />
      <WindowControlButton type="close" @click="$emit('close')" />
    </div>
  </header>
</template>

<style scoped>
.window-caption {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-text-primary);
}

.window-caption__identity {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 12px;
  min-width: 0; /* 保证标题省略号生效 */
}

.window-caption__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.window-caption__title {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.window-caption__controls {
  display: flex;
  height: 100%;
  flex-shrink: 0;
}
</style>
