import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

import { STORAGE_KEYS } from './storageKeys';

/** 与 useTheme 内部检测深色偏好所用的媒体查询保持一致 */
const DARK_SCHEME_MEDIA = '(prefers-color-scheme: dark)';

/** 系统配色变化监听器的签名（与 MediaQueryList.addEventListener 的 change 重载对齐） */
type ChangeListener = (type: string, listener: EventListenerOrEventListenerObject) => void;

describe('useTheme', () => {
  let storage: Record<string, string>;
  let dataset: Record<string, string>;
  let mediaChangeListener: EventListener | undefined;
  let mediaQuery: MediaQueryList;
  let setSystemPrefersDark: (prefersDark: boolean) => void;
  let addEventListenerMock: Mock<ChangeListener>;

  /**
   * 构造结构完整的 MediaQueryList 替身（含 media / onchange / removeEventListener 等成员），
   * 使其可直接当作原生 MediaQueryList 使用；仅 matches 通过闭包变为可写，用于模拟系统偏好切换。
   */
  function createMediaQueryList(initialPrefersDark: boolean): MediaQueryList {
    let prefersDark = initialPrefersDark;
    addEventListenerMock = vi.fn<ChangeListener>((type, listener) => {
      if (type === 'change' && typeof listener === 'function') {
        mediaChangeListener = listener;
      }
    });
    setSystemPrefersDark = (value) => {
      prefersDark = value;
    };

    return {
      media: DARK_SCHEME_MEDIA,
      get matches() {
        return prefersDark;
      },
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: addEventListenerMock,
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    };
  }

  /**
   * 加载主题模块。useTheme 在首次 import 时就会读取 window.matchMedia 并立即应用一次主题，
   * 因此系统偏好必须在这里设置，而不是 import 之后，避免用例依赖隐式的执行顺序。
   */
  async function importThemeModule(systemPrefersDark = false) {
    setSystemPrefersDark(systemPrefersDark);
    return import('./useTheme');
  }

  /** 模拟浏览器派发系统配色变化事件 */
  function emitSystemThemeChange(): void {
    mediaChangeListener?.(new Event('change'));
  }

  beforeEach(async () => {
    vi.unstubAllGlobals();
    // 重置模块缓存，确保每个用例都重新执行主题模块的初始化逻辑。
    vi.resetModules();
    // 先加载 Vue：避免之后替换 document 全局对象影响 Vue DOM 运行时初始化。
    await import('vue');
    storage = {};
    dataset = {};
    mediaChangeListener = undefined;
    mediaQuery = createMediaQueryList(false);

    // stubGlobal 临时替换全局对象；afterEach 中统一恢复，避免污染其他测试。
    vi.stubGlobal('window', {
      matchMedia: vi.fn(() => mediaQuery),
      localStorage: {
        getItem: vi.fn((key: string) => storage[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          storage[key] = value;
        }),
      },
    });
    vi.stubGlobal('document', { documentElement: { dataset } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('默认使用系统主题，并根据系统偏好应用浅色或深色', async () => {
    // 系统偏好为深色，必须在导入前设置：模块初始化时只会读取一次。
    const { useTheme } = await importThemeModule(true);
    const { theme } = useTheme();

    expect(theme.value).toBe('system');
    expect(dataset.theme).toBe('dark');
    expect(storage[STORAGE_KEYS.theme]).toBe('system');
    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('读取已保存且受支持的主题', async () => {
    storage[STORAGE_KEYS.theme] = 'light';
    const composable = await importThemeModule();
    expect(composable.useTheme().theme.value).toBe('light');
    expect(dataset.theme).toBe('light');
  });

  it('遇到不支持的已保存主题时回退到系统主题', async () => {
    storage[STORAGE_KEYS.theme] = 'sepia';
    const composable = await importThemeModule();

    expect(composable.useTheme().theme.value).toBe('system');
    expect(dataset.theme).toBe('light');
  });

  it('切换主题时同步更新页面和本地存储', async () => {
    const { useTheme } = await importThemeModule();
    const { theme, changeTheme } = useTheme();

    changeTheme('dark');

    expect(theme.value).toBe('dark');
    expect(dataset.theme).toBe('dark');
    expect(storage[STORAGE_KEYS.theme]).toBe('dark');
  });

  it('仅在系统主题模式下响应系统偏好变化', async () => {
    const { useTheme } = await importThemeModule();
    const { theme, changeTheme } = useTheme();

    setSystemPrefersDark(true);
    emitSystemThemeChange();
    expect(dataset.theme).toBe('dark');

    changeTheme('light');
    // 系统偏好在“显式选择主题”后继续变化，都不应覆盖用户的选择。
    setSystemPrefersDark(false);
    emitSystemThemeChange();
    expect(dataset.theme).toBe('light');

    setSystemPrefersDark(true);
    emitSystemThemeChange();
    expect(theme.value).toBe('light');
    expect(dataset.theme).toBe('light');
    expect(storage[STORAGE_KEYS.theme]).toBe('light');
  });

  it('本地存储不可用时仍可正常切换主题', async () => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn(() => mediaQuery),
      localStorage: {
        getItem: vi.fn(() => {
          throw new Error('storage unavailable');
        }),
        setItem: vi.fn(() => {
          throw new Error('storage unavailable');
        }),
      },
    });
    const { useTheme } = await importThemeModule();
    const { theme, changeTheme } = useTheme();

    changeTheme('dark');

    expect(theme.value).toBe('dark');
    expect(dataset.theme).toBe('dark');
  });
});
