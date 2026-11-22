<script setup lang="ts">
import { RepoListbox } from '@repo/components';

interface ListboxEntry {
  value: string | number;
  group?: string;
  disabled?: boolean;
}

const items: ListboxEntry[] = [
  { value: 'ready', group: '环境' },
  { value: 'testing', group: '环境' },
  { value: 'offline', group: '环境', disabled: true },
];
const labels: Record<string, string> = {
  ready: '可用',
  testing: '测试中',
  offline: '离线',
};
const statusClass: Record<string, string> = {
  ready: 'status-ready',
  testing: 'status-testing',
  offline: 'status-offline',
};
</script>

<template>
  <div class="listbox-example">
    <RepoListbox :items="items" :labels="labels">
      <template #item="{ item, label }">
        <span class="custom-item">
          <span class="status-mark" :class="statusClass[String(item.value)]"></span>
          <span>{{ label }}</span>
          <code>{{ item.value }}</code>
        </span>
      </template>
    </RepoListbox>
  </div>
</template>

<style scoped>
.listbox-example {
  display: flex;
  min-height: 300px;
  align-items: center;
  justify-content: center;
  background: #fcfcfd;
}

.custom-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-mark {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-ready {
  background: #31703d;
}

.status-testing {
  background: #8a5a00;
}

.status-offline {
  background: #5f6670;
}

.custom-item code {
  margin-left: auto;
  color: #5f6670;
  font-family: var(--font-mono);
  font-size: 10px;
}
</style>
