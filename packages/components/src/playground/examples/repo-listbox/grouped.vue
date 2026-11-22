<script setup lang="ts">
import { RepoListbox } from '@repo/components';

interface ListboxEntry {
  value: string | number;
  group?: string;
  disabled?: boolean;
}

defineOptions({ name: 'RepoListboxGroupedExample' });

const items: ListboxEntry[] = [
  { value: 'vue', group: '前端' },
  { value: 'vite', group: '前端' },
  { value: 'node', group: '后端' },
  { value: 'legacy', group: '后端', disabled: true },
  { value: 'typescript' },
];
const labels: Record<string, string> = {
  vue: 'Vue 3',
  vite: 'Vite',
  node: 'Node.js',
  legacy: '旧版服务（已停用）',
  typescript: 'TypeScript',
};
</script>

<template>
  <div class="listbox-example">
    <RepoListbox :items="items" :labels="labels" :group-order="['后端', '前端']" />
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
</style>
