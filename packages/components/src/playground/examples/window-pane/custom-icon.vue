<script setup lang="ts">
import { ref } from 'vue';

import { WindowPane } from '@repo/components';

const visible = ref(true);
</script>

<template>
  <div class="window-stage">
    <WindowPane
      v-if="visible"
      v-model:visible="visible"
      title="设置"
      :initial-rect="{ x: 16, y: 20, width: 460, height: 210 }"
    >
      <template #icon>
        <svg class="custom-window-icon" viewBox="0 0 20 20" aria-label="设置">
          <circle cx="10" cy="10" r="3" />
          <path
            d="M10 1.8v2M10 16.2v2M18.2 10h-2M3.8 10h-2M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4m11.6 0-1.4-1.4M5.6 5.6 4.2 4.2"
          />
        </svg>
      </template>
      <div class="window-content">
        <span class="window-label">ICON SLOT</span>
        <h4>标题栏插槽</h4>
        <p>通过 icon 插槽提供自定义图标；窗口控制按钮仍由组件负责。</p>
      </div>
    </WindowPane>
    <button v-else class="restore-button" type="button" @click="visible = true">重新打开窗口</button>
    <span class="window-state">{{ visible ? '窗口就绪' : '窗口已关闭' }}</span>
  </div>
</template>

<style scoped>
.window-stage {
  position: relative;
  height: 300px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #f5f7fa;
  transform: translateZ(0);
}

.custom-window-icon {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #2672b9;
  stroke-linecap: round;
  stroke-width: 1.5;
}

.window-content {
  padding: 20px 24px;
  user-select: text;
}

.window-label {
  color: #2672b9;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.window-content h4 {
  margin: 8px 0;
  color: #303133;
  font-size: 16px;
}

.window-content p {
  margin: 0;
  color: #606266;
  font-size: 13px;
}

.window-state {
  position: absolute;
  right: 12px;
  bottom: 10px;
  color: #5f6670;
  font-size: 11px;
}

.restore-button {
  margin: 16px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  color: #2672b9;
  cursor: pointer;
}
</style>
