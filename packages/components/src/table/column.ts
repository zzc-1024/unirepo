import type { TableColumn, TableColumnConfig } from './types';

/**
 * 辅助函数：用于在外部生成 TableColumn 配置时获得类型提示。
 * 用法：
 * ```ts
 * const columns = [defineColumn<MyType>({ key: 'name', label: '姓名' })]
 * ```
 */
export function defineColumn<T>(config: TableColumnConfig<T>): TableColumn<T> {
  return {
    accessor: (row) => row[config.key],
    label: config.label,
    render: config.render,
  };
}
