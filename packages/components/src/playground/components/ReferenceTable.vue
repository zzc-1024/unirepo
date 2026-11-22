<script setup lang="ts">
import type { ReferenceItem } from '../types';

defineProps<{
  /** Heading displayed above the reference table. */
  title: string;
  /** Reference rows to display. */
  items: ReferenceItem[];
}>();
</script>

<template>
  <section v-if="items.length > 0" class="reference-section">
    <h2>{{ title }}</h2>
    <div class="reference-table-wrap">
      <table class="reference-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>说明</th>
            <th>默认值</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.name">
            <td><code>{{ item.name }}</code></td>
            <td><code>{{ item.type }}</code></td>
            <td>{{ item.description }}</td>
            <td><code>{{ item.defaultValue ?? '—' }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.reference-section {
  margin-top: 40px;
}

h2 {
  margin: 0 0 16px;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}

.reference-table-wrap {
  overflow: auto;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
}

.reference-table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  text-align: left;
  vertical-align: top;
}

th {
  background: #f5f7fa;
  color: #606266;
  font-weight: 600;
  white-space: nowrap;
}

td {
  color: #606266;
}

tbody tr:last-child td {
  border-bottom: 0;
}

td code {
  color: #2672b9;
  font-family: var(--font-mono);
  font-size: 13px;
}

</style>
