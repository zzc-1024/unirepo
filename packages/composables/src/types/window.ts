/** 窗口矩形 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
