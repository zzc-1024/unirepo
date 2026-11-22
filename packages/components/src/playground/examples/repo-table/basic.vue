<script setup lang="ts">
import { ref } from 'vue';

import { RepoTable, type TableColumn } from '@repo/components';

defineOptions({ name: 'RepoTableBasicExample' });

interface Project {
  name: string;
  language: string;
  stars: number;
}

const projects = ref<Project[]>([
  { name: '组件文档', language: 'TypeScript', stars: 128 },
  { name: '桌面容器', language: 'Vue', stars: 84 },
  { name: '数据表格', language: 'TypeScript', stars: 56 },
]);

const columns: TableColumn<Project>[] = [
  { accessor: (row) => row.name, label: '项目', width: '42%' },
  { accessor: (row) => row.language, label: '主要技术' },
  { accessor: (row) => row.stars, label: '收藏', align: 'right', width: 90 },
];
</script>

<template>
  <RepoTable :data="projects" :columns="columns" table-key="playground-projects" />
</template>
