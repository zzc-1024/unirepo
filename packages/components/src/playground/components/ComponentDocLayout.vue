<script setup lang="ts">
import ExampleShowcase from './ExampleShowcase.vue';
import ReferenceTable from './ReferenceTable.vue';

import type { PlaygroundExample, ReferenceItem } from '../types';

defineProps<{
  /** Component heading shown on the reference page. */
  title: string;
  /** Short summary displayed directly below the heading. */
  summary: string;
  /** Longer component behavior and integration guidance. */
  description: string;
  /** Import statement shown in the usage callout. */
  importPath: string;
  /** Live examples and their source files. */
  examples: PlaygroundExample[];
  /** Public component properties. */
  props: ReferenceItem[];
  /** Public component events. */
  events: ReferenceItem[];
  /** Public component slots. */
  slots: ReferenceItem[];
}>();
</script>

<template>
  <article class="component-doc">
    <div class="page-eyebrow"><span class="page-eyebrow-line"></span> COMPONENT REFERENCE</div>
    <h1>{{ title }}</h1>
    <p class="page-summary">{{ summary }}</p>
    <p class="page-description">{{ description }}</p>

    <div class="import-callout">
      <span class="import-label">引入方式</span>
      <code>{{ importPath }}</code>
    </div>

    <section class="examples-section">
      <div class="section-title">
        <div>
          <span class="section-kicker">PLAYGROUND</span>
          <h2>示例</h2>
        </div>
        <span class="section-caption">可直接操作 · 源码与预览同步</span>
      </div>
      <div class="examples-list">
        <ExampleShowcase v-for="example in examples" :key="example.filePath" :example="example" />
      </div>
    </section>

    <ReferenceTable title="属性" :items="props" />
    <ReferenceTable title="事件" :items="events" />
    <ReferenceTable title="插槽" :items="slots" />
  </article>
</template>

<style scoped>
.component-doc {
  max-width: 900px;
  padding: 8px 0 40px;
}

.page-eyebrow,
.section-kicker {
  color: #5f6670;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.page-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.page-eyebrow-line {
  width: 24px;
  height: 1px;
  background: #409eff;
}

h1 {
  margin: 0;
  color: #303133;
  font-size: clamp(28px, 3.5vw, 36px);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.25;
}

.page-summary {
  margin: 12px 0 0;
  color: #606266;
  font-size: 16px;
  line-height: 1.65;
}

.page-description {
  max-width: 70ch;
  margin: 10px 0 0;
  color: #5f6670;
  font-size: 14px;
  line-height: 1.8;
}

.import-callout {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 54px;
  margin-top: 24px;
  padding: 12px 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #fcfcfd;
}

.import-label {
  flex: 0 0 auto;
  color: #5f6670;
  font-size: 12px;
}

.import-callout code {
  overflow: auto;
  color: #2672b9;
  font-family: var(--font-mono);
  font-size: 12px;
}

.examples-section {
  margin-top: 44px;
}

.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-title h2 {
  margin: 6px 0 0;
  color: #303133;
  font-size: 21px;
  font-weight: 600;
}

.section-caption {
  padding-bottom: 3px;
  color: #5f6670;
  font-size: 12px;
}

.examples-list {
  display: grid;
  gap: 20px;
}

@media (max-width: 768px) {
  .section-title {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .import-callout {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
