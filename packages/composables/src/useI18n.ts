import i18next, { changeLanguage } from '@repo/i18n';
import { computed, onScopeDispose, ref } from 'vue';

type SupportedLanguage = 'zh_CN' | 'en_US';

export function useI18n() {
  const language = ref<SupportedLanguage>(i18next.language as SupportedLanguage);
  const handleLanguageChanged = (nextLanguage: string) => {
    language.value = nextLanguage as SupportedLanguage;
  };

  i18next.on('languageChanged', handleLanguageChanged);
  onScopeDispose(() => i18next.off('languageChanged', handleLanguageChanged));

  const t = computed(() => i18next.getFixedT(language.value));

  return { t, language, changeLanguage };
}
