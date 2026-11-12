<!-- 1. 普通的 script 标签，用于导出接口和工具函数 -->
<script lang="ts">
import type { VNodeChild } from 'vue';

/**
 * 对外暴露的列配置项。
 */
export interface TableColumn<T> {
  /**
   * 获取该列数据的函数。
   * 例如：`(row) => row.well_name`
   */
  accessor: (row: T) => unknown;
  /** 表头显示的文字 */
  label: string;
  /** 自定义单元格渲染函数。若不提供，则直接显示 accessor 提取的原始值 */
  render?: (row: T) => VNodeChild;
}

/**
 * 辅助函数：用于在外部生成 TableColumn 配置时获得完美的类型提示。
 * 用法：const columns = [ defineColumn<MyType>({ key: 'name', label: '姓名' }) ]
 */
export function defineColumn<T>(config: {
  key: keyof T & string;
  label: string;
  render?: (row: T) => VNodeChild;
}): TableColumn<T> {
  return {
    accessor: (row) => row[config.key],
    label: config.label,
    render: config.render,
  };
}
</script>

<!-- 2. setup 标签，写组件逻辑 -->
<script setup lang="ts" generic="TData extends Record<string, any>">
import { FlexRender, createColumnHelper, tableFeatures, useTable } from '@tanstack/vue-table';
import { computed } from 'vue';

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

/** 将外部配置转换为 TanStack 内部需要的 ColumnDef 数组 */
const internalColumns = computed(() => {
  return props.columns.map((col) => {
    // 💡 核心修复点：传入函数作为 accessor，完美避开对泛型 key 的严格校验
    return columnHelper.accessor(col.accessor, {
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
  <table>
    <thead>
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th v-for="header in headerGroup.headers" :key="header.id">
          <FlexRender v-if="!header.isPlaceholder" :header="header" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in table.getRowModel().rows" :key="row.id">
        <td v-for="cell in row.getAllCells()" :key="cell.id">
          <FlexRender :cell="cell" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
