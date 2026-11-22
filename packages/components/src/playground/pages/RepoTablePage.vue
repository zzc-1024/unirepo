<script setup lang="ts">
import ComponentDocLayout from '../components/ComponentDocLayout.vue';
import ReferenceTable from '../components/ReferenceTable.vue';
import { createExample } from '../examples';
import type { ReferenceItem } from '../types';

const examples = [
  createExample(
    'repo-table/basic.vue',
    '类型安全列配置',
    '使用 accessor 从数据行取值，列宽、对齐方式和表格标识均可配置。',
  ),
  createExample(
    'repo-table/custom-cell.vue',
    '自定义单元格',
    '通过 render 返回 Vue 节点展示状态标签和行级操作。',
  ),
];

const props: ReferenceItem[] = [
  { name: 'data', type: 'TData[]', description: '表格行数据。' },
  { name: 'columns', type: 'TableColumn<TData>[]', description: '列配置，包含 accessor、label 和可选 render。' },
  { name: 'tableKey', type: 'string', description: '表格实例标识。', defaultValue: "'data-table'" },
];

const columns: ReferenceItem[] = [
  { name: 'accessor', type: '(row: TData) => unknown', description: '从数据行读取本列值。' },
  { name: 'label', type: 'string', description: '表头显示文字。' },
  { name: 'render', type: '(row: TData) => VNodeChild', description: '自定义单元格渲染函数。' },
  { name: 'align', type: "'left' | 'center' | 'right'", description: '单元格水平对齐方式。', defaultValue: "'left'" },
  { name: 'width', type: 'string | number', description: '列宽；数字按像素处理。' },
];
</script>

<template>
  <ComponentDocLayout
    title="RepoTable 数据表格"
    summary="以类型安全的列定义渲染数据，并支持自定义单元格内容。"
    description="列配置使用 accessor 函数读取数据，不要求调用者了解底层表格库的列 API。render 可以返回文本、DOM 或 Vue VNode。"
    import-path="import { RepoTable, type TableColumn } from '@repo/components';"
    :examples="examples"
    :props="props"
    :events="[]"
    :slots="[]"
  />
  <div class="table-config-reference">
    <h2>TableColumn 列配置</h2>
    <p>每一列都使用 TableColumn&lt;TData&gt; 描述。</p>
    <ReferenceTable title="字段" :items="columns" />
  </div>
</template>

<style scoped>
.table-config-reference {
  max-width: 900px;
}

.table-config-reference > h2 {
  margin: 8px 0 8px;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.table-config-reference > p {
  margin: 0;
  color: #5f6670;
  font-size: 14px;
}
</style>
