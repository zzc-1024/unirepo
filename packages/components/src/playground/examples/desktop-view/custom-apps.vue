<script setup lang="ts">
import { ref } from 'vue';

import { DesktopView } from '@repo/components';
import type { AppDef } from '@repo/composables';

const selection = ref('选择一个应用');
const apps: AppDef[] = [
  {
    id: 'design',
    name: '设计稿',
    color: '#9a3e26',
    icon: ['M4 4h16v16H4z', 'M8 16l3-7 5 7', 'M9 14h6'],
  },
  {
    id: 'calendar',
    name: '日历',
    color: '#2672b9',
    icon: ['M4 5h16v15H4z', 'M8 3v4M16 3v4M4 9h16', 'M8 13h2M13 13h2M8 16h2'],
  },
  {
    id: 'metrics',
    name: '指标',
    color: '#5f6670',
    icon: ['M4 19V5M4 19h17', 'm7 15 4-4 3 2 5-7'],
  },
];
</script>

<template>
  <div class="desktop-example">
    <DesktopView :apps="apps" @open-app="selection = `打开事件：${$event}`" />
    <div class="desktop-hint">{{ selection }}</div>
  </div>
</template>

<style scoped>
.desktop-example {
  position: relative;
  height: 300px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
}

.desktop-example :deep(.desktop) {
  width: 100%;
  height: 100%;
  padding: 18px;
}

.desktop-hint {
  position: absolute;
  right: 12px;
  bottom: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(31, 45, 61, 0.62);
  color: #fff;
  font-size: 11px;
  pointer-events: none;
}
</style>
