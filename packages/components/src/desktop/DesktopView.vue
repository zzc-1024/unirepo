<script setup lang="ts">
import type { AppDef } from '@repo/composables';
import { ref } from 'vue';

defineProps<{
  /** 桌面应用列表 */
  apps: AppDef[];
}>();

const emit = defineEmits<{
  openApp: [id: string];
}>();

/** 当前选中的应用 id */
const selectedId = ref<string | null>(null);

/** 单击：选中 */
function selectApp(id: string): void {
  selectedId.value = id;
}

/** 双击：打开（此处仅打印日志） */
function openApp(app: AppDef): void {
  emit('openApp', app.id);
}

/** 点击桌面空白处：取消选中 */
function clearSelection(): void {
  selectedId.value = null;
}
</script>

<template>
  <div class="desktop" @click.self="clearSelection">
    <div
      v-for="app in apps"
      :key="app.id"
      class="app-icon"
      :class="{ 'app-icon--selected': selectedId === app.id }"
      @click="selectApp(app.id)"
      @dblclick="openApp(app)"
    >
      <div class="app-icon__badge" :style="{ backgroundColor: app.color }">
        <svg viewBox="0 0 24 24" fill="#ffffff">
          <path v-for="(pathData, index) in app.icon" :key="index" :d="pathData" />
        </svg>
      </div>
      <span class="app-icon__name">{{ app.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.desktop {
  width: 100dvw;
  height: 100dvh;
  box-sizing: border-box;
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
  user-select: none;

  .app-icon {
    width: 88px;
    padding: 10px 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
    }
  }

  /* ✅ BEM 修饰符和元素：移出嵌套，显式写完整类名 */
  .app-icon--selected {
    background-color: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.35);
  }

  .app-icon__badge {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

    svg {
      width: 30px;
      height: 30px;
    }
  }

  .app-icon__name {
    font-size: 13px;
    line-height: 1.3;
    text-align: center;
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  }
}
</style>
