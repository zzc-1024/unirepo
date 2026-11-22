<script setup lang="ts">
import { h } from 'vue';
import { ref } from 'vue';

import { RepoTable, type TableColumn } from '@repo/components';

interface Service {
  name: string;
  status: 'online' | 'paused';
  endpoint: string;
}

const services: Service[] = [
  { name: '文档站', status: 'online', endpoint: '/docs' },
  { name: '模型服务', status: 'paused', endpoint: '/api/models' },
  { name: '消息网关', status: 'online', endpoint: '/api/chat' },
];
const actionMessage = ref('');

const columns: TableColumn<Service>[] = [
  { accessor: (row) => row.name, label: '服务' },
  {
    accessor: (row) => row.status,
    label: '状态',
    render: (row) =>
      h(
        'span',
        { class: ['service-status', row.status === 'online' ? 'is-online' : 'is-paused'] },
        row.status === 'online' ? '运行中' : '已暂停',
      ),
  },
  {
    accessor: (row) => row.endpoint,
    label: '操作',
    align: 'right',
    render: (row) =>
      h(
        'button',
        {
          class: 'service-action',
          type: 'button',
          onClick: () => (actionMessage.value = `已选择：${row.endpoint}`),
        },
        '查看',
      ),
  },
];
</script>

<template>
  <div class="custom-table">
    <RepoTable :data="services" :columns="columns" table-key="playground-services" />
    <p class="action-message" role="status">{{ actionMessage || '点击“查看”触发行级操作。' }}</p>
  </div>
</template>

<style>
.service-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.service-status::before {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  content: '';
}

.service-status.is-online {
  color: #31703d;
}

.service-status.is-paused {
  color: #5f6670;
}

.service-action {
  padding: 4px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  color: #2672b9;
  font-size: 12px;
  cursor: pointer;
}

.service-action:hover {
  border-color: #a0cfff;
  background: #ecf5ff;
}

.action-message {
  margin: 10px 0 0;
  color: #5f6670;
  font-size: 12px;
}
</style>
