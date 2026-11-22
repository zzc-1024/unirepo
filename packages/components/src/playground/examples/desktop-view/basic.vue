<script setup lang="ts">
import { ref } from 'vue';

import { DesktopView } from '@repo/components';
import type { AppDef } from '@repo/composables';

defineOptions({ name: 'DesktopViewBasicExample' });

const openedApp = ref('双击应用图标查看结果');
const apps: AppDef[] = [
  {
    id: 'notes',
    name: '便笺',
    color: '#2672b9',
    icon: ['M5 3.5h14v17H5z', 'M8 8h8M8 12h8M8 16h5'],
  },
  {
    id: 'archive',
    name: '文件',
    color: '#8a5a00',
    icon: ['M3 5h18v15H3z', 'M2 5l2-3h6l2 3', 'M8 11h8'],
  },
  {
    id: 'reports',
    name: '报表',
    color: '#31703d',
    icon: ['M4 3h16v18H4z', 'M8 8h8M8 12h8M8 16h4'],
  },
];
</script>

<template>
  <div class="desktop-example">
    <DesktopView :apps="apps" @open-app="openedApp = `已打开：${$event}`" />
    <div class="desktop-hint">{{ openedApp }}</div>
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
