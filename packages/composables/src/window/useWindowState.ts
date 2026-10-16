import { ref } from 'vue';

import type { Rect } from '../types/window';

/**
 * 窗口状态管理：位置尺寸、最大化（含还原记忆）、最小化
 */
export function useWindowState(initialRect: Rect) {
  const rect = ref<Rect>({ ...initialRect });
  const maximized = ref(false);
  const minimized = ref(false);

  /** 最大化前的窗口矩形，用于还原 */
  let savedRect: Rect = { ...initialRect };

  function maximize(): void {
    if (!maximized.value) savedRect = { ...rect.value };
    maximized.value = true;
  }

  function restore(): void {
    if (!maximized.value) return;
    maximized.value = false;
    rect.value = { ...savedRect };
  }

  function toggleMaximize(): void {
    if (maximized.value) restore();
    else maximize();
  }

  function minimize(): void {
    minimized.value = true;
  }

  function show(): void {
    minimized.value = false;
  }

  return { rect, maximized, minimized, maximize, restore, toggleMaximize, minimize, show };
}
