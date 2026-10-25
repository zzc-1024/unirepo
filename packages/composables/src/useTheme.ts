import { ref } from 'vue';

import { STORAGE_KEYS } from './storageKeys';

export type Theme = 'system' | 'light' | 'dark';

const THEME_OPTIONS: Theme[] = ['system', 'light', 'dark'];
const systemThemeMedia =
  typeof window === 'undefined' ? null : window.matchMedia('(prefers-color-scheme: dark)');

function getInitialTheme(): Theme {
  if (!systemThemeMedia) {
    return 'system';
  }

  try {
    const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
    return THEME_OPTIONS.find((option) => option === savedTheme) ?? 'system';
  } catch {
    return 'system';
  }
}

const theme = ref<Theme>(getInitialTheme());

function applyTheme(nextTheme: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme =
      nextTheme === 'system' ? (systemThemeMedia?.matches ? 'dark' : 'light') : nextTheme;
  }

  try {
    window.localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  } catch {
    // 存储不可用时，保持内存中的主题仍然生效。
  }
}

applyTheme(theme.value);
systemThemeMedia?.addEventListener('change', () => {
  if (theme.value === 'system') {
    applyTheme('system');
  }
});

export function useTheme() {
  function changeTheme(nextTheme: Theme): void {
    theme.value = nextTheme;
    applyTheme(nextTheme);
  }

  return { theme, changeTheme };
}
