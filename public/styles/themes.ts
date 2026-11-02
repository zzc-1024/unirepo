/** 样式仓库支持的主题 ID；新增主题时在此登记，ID 同时用于 data-theme。 */
export const THEME_IDS = {
  light: 'light',
  dark: 'dark',
} as const;

/** 所有主题 ID 的联合类型，由 THEME_IDS 自动推导。 */
export type ThemeName = (typeof THEME_IDS)[keyof typeof THEME_IDS];

/** 主题选项及其界面名称；设置页据此生成主题选择项。 */
export const THEMES = [
  {
    id: THEME_IDS.light,
    label: {
      zh_CN: '浅色',
      en_US: 'Light',
    },
  },
  {
    id: THEME_IDS.dark,
    label: {
      zh_CN: '深色',
      en_US: 'Dark',
    },
  },
] as const;

/** 操作系统报告的配色偏好，与应用主题 ID 是不同概念。 */
export type SystemColorScheme = 'light' | 'dark';

/** 用户选择“跟随系统”时，各系统配色对应使用的默认主题。 */
export const DEFAULT_THEME_BY_SYSTEM_SCHEME = {
  light: THEME_IDS.light,
  dark: THEME_IDS.dark,
} as const satisfies Record<SystemColorScheme, ThemeName>;

/** 根据系统配色偏好返回显式配置的默认主题。 */
export function getSystemTheme(scheme: SystemColorScheme): ThemeName {
  return DEFAULT_THEME_BY_SYSTEM_SCHEME[scheme];
}
