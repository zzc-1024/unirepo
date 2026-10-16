import i18next from 'i18next';

import { en_US } from './en_US';
import { zh_CN } from './zh_CN';

// ==================== 1. 定义翻译资源结构 ====================
// 所有语言的 key 必须与默认语言(zh)保持一致，实现编译期类型检查
const resources = {
  zh_CN,
  en_US,
} as const satisfies Record<string, typeof zh_CN>; // 关键：as const 保留字面量类型

export type NavigationTranslationKey = `navigation.${keyof typeof zh_CN.translation.navigation}`;

// ==================== 2. 类型增强（全局生效）====================
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof zh_CN; // 用默认语言作为类型基准
    returnNull: false; // 禁止返回 null，简化使用
  }
}

// ==================== 3. 初始化 i18next ====================
i18next.init({
  lng: 'zh_CN', // 当前语言
  fallbackLng: 'zh_CN', // 回退语言
  resources, // 内联翻译资源
  interpolation: {
    escapeValue: false, // React/Vue 已自带 XSS 防护，无需双重转义
  },
  returnNull: false, // 与类型声明保持一致
});

export default i18next;

// ==================== 4. 便捷导出 ====================
/** 带类型的翻译函数快捷方式 */
export const t = i18next.t.bind(i18next);

/** 切换语言的辅助函数 */
export async function changeLanguage(lng: keyof typeof resources) {
  await i18next.changeLanguage(lng);
}
