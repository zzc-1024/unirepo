<script setup lang="ts">
import { ref } from 'vue';

import { WindowPane } from '@repo/components';

defineOptions({ name: 'WindowPaneBasicExample' });

const visible = ref(true);
</script>

<template>
  <div class="window-stage">
    <WindowPane
      v-if="visible"
      v-model:visible="visible"
      title="项目说明"
      :initial-rect="{ x: 16, y: 20, width: 520, height: 210 }"
    >
      <div class="window-content">
        <span class="window-label">窗口内容</span>
        <h4>可拖动，也可调整大小</h4>
        <p>尝试拖动标题栏，或者从窗口边缘和右下角调整尺寸。</p>
      </div>
    </WindowPane>
    <button v-else class="restore-button" type="button" @click="visible = true">重新打开窗口</button>
  </div>
</template>

<style scoped>
.window-stage {
  position: relative;
  height: 300px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background:
    linear-gradient(#e9edf3 1px, transparent 1px),
    linear-gradient(90deg, #e9edf3 1px, transparent 1px),
    #f5f7fa;
  background-size: 24px 24px;
  transform: translateZ(0);
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
