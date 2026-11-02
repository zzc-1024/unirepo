import { getSystemTheme, THEMES, type ThemeName } from '@repo/styles/themes';
import { ref } from 'vue';

import { STORAGE_KEYS } from './storageKeys';

/** system 表示跟随系统；其余值由样式仓库声明。 */
export type Theme = 'system' | ThemeName;

/** 模块加载时读取一次系统配色，用于初始化主题并监听后续变化。 */
const systemThemeMedia =
  typeof window === 'undefined' ? null : window.matchMedia('(prefers-color-scheme: dark)');

/** 校验本地存储的值是否仍属于当前支持的主题。 */
function isTheme(value: string | null): value is Theme {
  return value === 'system' || THEMES.some(({ id }) => id === value);
}

/** 优先恢复有效的用户选择；无效或不可用时回退为跟随系统。 */
function getInitialTheme(): Theme {
  if (!systemThemeMedia) {
    return 'system';
  }

  try {
    const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
    return isTheme(savedTheme) ? savedTheme : 'system';
  } catch {
    return 'system';
  }
}

const theme = ref<Theme>(getInitialTheme());

/** 将主题应用到根元素，并尽力持久化用户偏好。 */
function applyTheme(nextTheme: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme =
      nextTheme === 'system'
        ? getSystemTheme(systemThemeMedia?.matches ? 'dark' : 'light')
        : nextTheme;
  }

  try {
    window.localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  } catch {
    // 存储不可用时，保持内存中的主题仍然生效。
  }
}

// 模块初始化时立即应用恢复出的主题。
applyTheme(theme.value);
systemThemeMedia?.addEventListener('change', () => {
  if (theme.value === 'system') {
    applyTheme('system');
  }
});

/** 提供当前主题及切换主题的方法。 */
export function useTheme() {
  function changeTheme(nextTheme: Theme): void {
    theme.value = nextTheme;
    applyTheme(nextTheme);
  }

  return { theme, changeTheme };
}
