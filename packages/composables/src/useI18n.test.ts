import { beforeEach, describe, expect, it, vi } from 'vitest';
import { effectScope } from 'vue';

// vi.mock 会被提升到导入之前；vi.hoisted 让 mock 数据也能在提升后的工厂中安全访问。
const i18nMock = vi.hoisted(() => {
  const listeners: Array<(language: string) => void> = [];
  return {
    listeners,
    on: vi.fn((_event: string, listener: (language: string) => void) => {
      listeners.push(listener);
    }),
    off: vi.fn((_event: string, listener: (language: string) => void) => {
      const index = listeners.indexOf(listener);
      if (index >= 0) listeners.splice(index, 1);
    }),
    getFixedT: vi.fn((language: string) => (key: string) => `${language}:${key}`),
    changeLanguage: vi.fn(),
  };
});

// 替换真实 i18next 实例，避免测试之间共享全局语言状态或监听器。
vi.mock('@repo/i18n', () => ({
  default: {
    language: 'zh_CN',
    on: i18nMock.on,
    off: i18nMock.off,
    getFixedT: i18nMock.getFixedT,
  },
  changeLanguage: i18nMock.changeLanguage,
}));

import { useI18n } from './useI18n';

describe('useI18n', () => {
  beforeEach(() => {
    i18nMock.listeners.length = 0;
    vi.clearAllMocks();
  });

  it('提供当前语言、固定语言的翻译函数和切换语言方法', () => {
    // effectScope 创建 Vue 作用域，使组合式函数中的 onScopeDispose 可正常注册。
    const scope = effectScope();
    const composable = scope.run(useI18n)!;

    expect(composable.language.value).toBe('zh_CN');
    expect(composable.t.value('greeting')).toBe('zh_CN:greeting');
    expect(composable.changeLanguage).toBe(i18nMock.changeLanguage);

    scope.stop();
  });

  it('在 i18next 发出语言变更事件时同步更新语言', () => {
    const scope = effectScope();
    const composable = scope.run(useI18n)!;

    i18nMock.listeners[0]?.('en_US');

    expect(composable.language.value).toBe('en_US');
    expect(composable.t.value('greeting')).toBe('en_US:greeting');
    scope.stop();
  });

  it('所属作用域停止时移除语言变更监听器', () => {
    const scope = effectScope();
    scope.run(useI18n);
    const listener = i18nMock.listeners[0];

    scope.stop();

    expect(i18nMock.off).toHaveBeenCalledWith('languageChanged', listener);
    expect(i18nMock.listeners).toHaveLength(0);
  });
});
