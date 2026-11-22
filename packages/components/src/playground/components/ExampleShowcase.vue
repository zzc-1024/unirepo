<script setup lang="ts">
import { onUnmounted, ref } from 'vue';

import type { PlaygroundExample } from '../types';

defineProps<{
  /** Live preview component and source loaded from one Vue file. */
  example: PlaygroundExample;
}>();

const codeVisible = ref(false);
const copyStatus = ref('');
let copyStatusTimeout: ReturnType<typeof setTimeout> | undefined;

onUnmounted(() => {
  if (copyStatusTimeout) clearTimeout(copyStatusTimeout);
});

async function copySource(source: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(source);
    copyStatus.value = '已复制';
  } catch (error) {
    copyStatus.value =
      error instanceof Error ? `复制失败：${error.message}` : '复制失败，请检查浏览器权限';
  }
  if (copyStatusTimeout) clearTimeout(copyStatusTimeout);
  copyStatusTimeout = setTimeout(() => (copyStatus.value = ''), 2400);
}
</script>

<template>
  <article class="example-card">
    <header class="example-heading">
      <div>
        <h3>{{ example.title }}</h3>
        <p>{{ example.description }}</p>
      </div>
      <span class="example-file">{{ example.filePath }}</span>
    </header>

    <div class="example-preview">
      <Suspense>
        <component :is="example.component" />
        <template #fallback>
          <div class="preview-loading" role="status">正在加载示例…</div>
        </template>
      </Suspense>
    </div>

    <footer class="example-toolbar">
      <span class="preview-label">
        <span class="preview-dot"></span>
        交互预览
      </span>
      <div class="example-actions">
        <span v-if="copyStatus" class="copy-status" role="status">{{ copyStatus }}</span>
        <button
          type="button"
          class="code-toggle"
          :aria-expanded="codeVisible"
          @click="codeVisible = !codeVisible"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m5.5 4-4 4 4 4M10.5 4l4 4-4 4M9 2l-2 12" />
          </svg>
          {{ codeVisible ? '收起代码' : '查看代码' }}
        </button>
        <button
          v-if="codeVisible"
          type="button"
          class="copy-button"
          @click="copySource(example.source)"
        >
          复制
        </button>
      </div>
    </footer>

    <div v-if="codeVisible" class="source-view">
      <pre><code>{{ example.source }}</code></pre>
    </div>
  </article>
</template>

<style scoped>
.example-card {
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #fff;
}

.example-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 24px 16px;
}

.example-heading h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.example-heading p {
  margin: 6px 0 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.example-file {
  flex: 0 0 auto;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f5f7fa;
  color: #5f6670;
  font-family: var(--font-mono);
  font-size: 11px;
}

.example-preview {
  min-height: 150px;
  padding: 24px;
  border-top: 1px solid #f0f2f5;
}

.preview-loading {
  display: grid;
  min-height: 100px;
  place-items: center;
  color: #5f6670;
  font-size: 13px;
}

.example-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 24px;
  border-top: 1px solid #e4e7ed;
  background: #fcfcfd;
}

.preview-label,
.example-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5f6670;
  font-size: 12px;
}

.preview-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #31703d;
}

.code-toggle,
.copy-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #606266;
  font-size: 12px;
  cursor: pointer;
}

.code-toggle:hover,
.copy-button:hover {
  color: #2672b9;
  background: #ecf5ff;
}

.code-toggle svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.3;
}

.copy-status {
  color: #31703d;
}

.source-view {
  max-height: 520px;
  overflow: auto;
  border-top: 1px solid #e4e7ed;
  background: #f8fafc;
}

pre {
  margin: 0;
  padding: 20px 24px;
  color: #303133;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.7;
  tab-size: 2;
}

@media (max-width: 768px) {
  .example-heading {
    flex-direction: column;
    gap: 10px;
    padding: 16px;
  }

  .example-file {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .example-preview {
    padding: 16px;
  }

  .example-toolbar {
    padding-inline: 16px;
  }

  pre {
    padding: 16px;
  }
}
</style>
