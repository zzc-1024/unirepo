import { describe, expect, it } from 'vitest';

import { useWindowState } from './useWindowState';

describe('useWindowState', () => {
  it('将初始窗口矩形复制到响应式状态中', () => {
    const initialRect = { x: 10, y: 20, width: 800, height: 600 };
    const state = useWindowState(initialRect);

    expect(state.rect.value).toEqual(initialRect);
    expect(state.rect.value).not.toBe(initialRect);
  });

  it('最大化时记住当前矩形，还原时恢复', () => {
    const state = useWindowState({ x: 10, y: 20, width: 800, height: 600 });
    state.rect.value = { x: 50, y: 60, width: 900, height: 700 };

    state.maximize();
    expect(state.maximized.value).toBe(true);

    state.restore();
    expect(state.maximized.value).toBe(false);
    expect(state.rect.value).toEqual({ x: 50, y: 60, width: 900, height: 700 });
  });

  it('重复最大化不覆盖已记忆的矩形', () => {
    const state = useWindowState({ x: 0, y: 0, width: 800, height: 600 });
    state.rect.value = { x: 50, y: 60, width: 900, height: 700 };
    state.maximize();

    // 模拟最大化后窗口铺满屏幕
    state.rect.value = { x: 0, y: 0, width: 1920, height: 1080 };
    state.maximize();
    state.restore();

    expect(state.rect.value).toEqual({ x: 50, y: 60, width: 900, height: 700 });
  });

  it('切换最大化状态，并在未最大化时忽略还原操作', () => {
    const initialRect = { x: 10, y: 20, width: 800, height: 600 };
    const state = useWindowState(initialRect);

    state.restore();
    expect(state.rect.value).toEqual(initialRect);

    state.toggleMaximize();
    expect(state.maximized.value).toBe(true);
    state.toggleMaximize();
    expect(state.maximized.value).toBe(false);
    expect(state.rect.value).toEqual(initialRect);
  });

  it('最小化窗口后可以重新显示', () => {
    const state = useWindowState({ x: 0, y: 0, width: 800, height: 600 });

    state.minimize();
    expect(state.minimized.value).toBe(true);

    state.show();
    expect(state.minimized.value).toBe(false);
  });
});
