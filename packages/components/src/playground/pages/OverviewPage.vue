<script setup lang="ts">
import { pageGroups } from '../registry';

const componentPages = pageGroups.find((group) => group.title === '基础组件')?.pages ?? [];
</script>

<template>
  <div class="overview-page">
    <div class="eyebrow"><span class="eyebrow-line"></span> REPO COMPONENTS / PLAYGROUND</div>
    <h1>组件 playground</h1>
    <p class="lead">
      在一个地方浏览共享组件、查看交互示例，并直接复制示例源码。每个预览都由独立的 Vue
      示例文件驱动，代码展示从同一文件自动读取。
    </p>

    <div class="quick-start">
      <div>
        <span class="quick-start-label">快速上手</span>
        <p>从包入口导入组件，并在应用中组合使用。</p>
      </div>
      <pre><code>import { RepoTable } from '@repo/components';</code></pre>
    </div>

    <div class="section-heading">
      <div>
        <span class="section-kicker">组件目录</span>
        <h2>选择一个组件开始</h2>
      </div>
      <span class="component-count">{{ componentPages.length }} 个组件</span>
    </div>

    <div class="component-list">
      <a
        v-for="(page, index) in componentPages"
        :key="page.id"
        class="component-item"
        :href="`#${page.id}`"
      >
        <span class="component-number">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="component-copy">
          <h3>{{ page.title }}</h3>
          <p>{{ page.summary }}</p>
        </div>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h10M8 3l5 5-5 5" />
        </svg>
      </a>
    </div>

    <div class="note">
      <span class="note-marker">i</span>
      <p>修改 <code>src/playground/examples/</code> 中的示例文件后，预览和代码面板会同步更新。</p>
    </div>
  </div>
</template>

<style scoped>
.overview-page {
  max-width: 820px;
  padding: 8px 0 40px;
}

.eyebrow,
.section-kicker,
.quick-start-label {
  color: #5f6670;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  font-family: var(--font-mono);
}

.eyebrow-line {
  width: 24px;
  height: 1px;
  background: #409eff;
}

h1 {
  margin: 0;
  color: #303133;
  font-size: clamp(30px, 4vw, 40px);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.lead {
  max-width: 70ch;
  margin: 18px 0 0;
  color: #606266;
  font-size: 16px;
  line-height: 1.8;
}

.quick-start {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 36px;
  padding: 20px 24px;
  border: 1px solid #e4e7ed;
  border-left: 3px solid #409eff;
  border-radius: 6px;
  background: #fff;
}

.quick-start-label {
  color: #2672b9;
}

.quick-start p {
  margin: 6px 0 0;
  color: #606266;
  font-size: 13px;
}

.quick-start pre {
  margin: 0;
  padding: 10px 12px;
  border-radius: 4px;
  background: #f5f7fa;
  color: #303133;
  font-family: var(--font-mono);
  font-size: 12px;
  white-space: nowrap;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 48px 0 16px;
}

.section-heading h2 {
  margin: 6px 0 0;
  color: #303133;
  font-size: 21px;
  font-weight: 600;
}

.component-count {
  color: #5f6670;
  font-size: 12px;
}

.component-list {
  border-top: 1px solid #e4e7ed;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 78px;
  border-bottom: 1px solid #e4e7ed;
  transition: background-color 120ms ease;
}

.component-item:hover {
  background: #f8fafc;
}

.component-number {
  width: 32px;
  color: #5f6670;
  font-family: var(--font-mono);
  font-size: 12px;
}

.component-copy {
  flex: 1;
}

.component-copy h3 {
  margin: 0;
  color: #303133;
  font-size: 15px;
  font-weight: 600;
}

.component-copy p {
  margin: 5px 0 0;
  color: #5f6670;
  font-size: 13px;
}

.component-item > svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #5f6670;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.4;
  transition: transform 120ms ease;
}

.component-item:hover > svg {
  transform: translateX(3px);
  stroke: #2672b9;
}

.note {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 32px;
  padding: 14px 16px;
  border: 1px solid #d9ecff;
  border-radius: 6px;
  background: #f4f9ff;
}

.note-marker {
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  flex: 0 0 auto;
  border: 1px solid #409eff;
  border-radius: 50%;
  color: #2672b9;
  font-family: Georgia, serif;
  font-size: 12px;
  font-style: italic;
}

.note p {
  margin: 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}

.note code {
  color: #2672b9;
  font-family: var(--font-mono);
  font-size: 12px;
}

@media (max-width: 768px) {
  .quick-start {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .quick-start pre {
    max-width: 100%;
    overflow: auto;
  }
}
</style>
