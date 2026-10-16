/** 桌面应用展示定义 */
export interface AppDef {
  id: string;
  name: string;
  color: string;
  /** SVG path 的 d 数据列表（多段图标按顺序逐段渲染） */
  icon: string[];
}
