<script setup lang="ts" generic="TData extends Record<string, any>">
import { FlexRender, createColumnHelper, tableFeatures, useTable } from '@tanstack/vue-table';
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

import type { TableColumn } from './types';

/** 表格内部使用的特性配置 */
const features = tableFeatures({});

const props = defineProps<{
  /** 列的配置列表 */
  columns: TableColumn<TData>[];
  /** 表格要展示的数据数组 */
  data: TData[];
  /** 表格的唯一标识 */
  tableKey?: string;
}>();

const columnHelper = createColumnHelper<typeof features, TData>();
const columnStyles = computed<Record<string, CSSProperties>>(() =>
  Object.fromEntries(
    props.columns.map((column, index) => [
      `repo-table-column-${index}`,
      { textAlign: column.align ?? 'left', width: column.width },
    ]),
  ),
);

/** 将外部配置转换为 TanStack 内部需要的 ColumnDef 数组 */
const internalColumns = computed(() => {
  return props.columns.map((col, index) => {
    // 💡 核心修复点：传入函数作为 accessor，完美避开对泛型 key 的严格校验
    return columnHelper.accessor(col.accessor, {
      id: `repo-table-column-${index}`,
      header: col.label,
      cell: (info) => {
        // 如果外部提供了 render，优先使用
        if (col.render) {
          return col.render(info.row.original);
        }
        // 否则返回通过 accessor 提取的值
        return info.getValue();
      },
    });
  });
});

const table = useTable({
  key: props.tableKey ?? 'data-table',
  features,
  columns: internalColumns.value,
  data: props.data,
});
</script>

<template>
  <table class="repo-table">
    <thead>
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th
          v-for="header in headerGroup.headers"
          :key="header.id"
          :style="columnStyles[header.column.id]"
        >
          <FlexRender v-if="!header.isPlaceholder" :header="header" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in table.getRowModel().rows" :key="row.id">
        <td v-for="cell in row.getAllCells()" :key="cell.id" :style="columnStyles[cell.column.id]">
          <FlexRender :cell="cell" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style src="./RepoTable.css"></style>
