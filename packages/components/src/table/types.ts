import type { VNodeChild } from 'vue';

/**
 * 对外暴露的列配置项。
 * 参数：
 * @param accessor - 获取该列数据的函数。
 * @param label - 表头显示的文字。
 * @param render - 自定义单元格渲染函数。
 */
export interface TableColumn<T> {
  /** 获取该列数据的函数。 */
  accessor: (row: T) => unknown;
  /** 表头显示的文字。 */
  label: string;
  /** 自定义单元格渲染函数。 */
  render?: (row: T) => VNodeChild;
  /** 该列内容的水平对齐方式，默认左对齐。 */
  align?: 'left' | 'center' | 'right';
  /** 该列宽度，数字按像素处理，也可传入 CSS 长度。 */
  width?: string | number;
}

/**
 * defineColumn 的参数配置，不直接参与构成数据表。
 * 参数：
 * @param key - 对应数据对象的属性名。
 * @param label - 表头显示的文字。
 * @param render - 自定义单元格渲染函数。
 */
export interface TableColumnConfig<T> {
  key: keyof T & string;
  label: string;
  render?: (row: T) => VNodeChild;
  /** 该列内容的水平对齐方式，默认左对齐。 */
  align?: 'left' | 'center' | 'right';
  /** 该列宽度，数字按像素处理，也可传入 CSS 长度。 */
  width?: string | number;
}
