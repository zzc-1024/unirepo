<template>
  <section class="settings-page">
    <header class="settings-page__header">
      <h1>{{ t('settings.title') }}</h1>
    </header>

    <div class="settings-row">
      <div class="settings-row__copy">
        <label for="language-select">{{ t('settings.language') }}</label>
        <p id="language-description">{{ t('settings.language_description') }}</p>
      </div>

      <select
        id="language-select"
        :value="language"
        aria-describedby="language-description"
        @change="handleLanguageChange"
      >
        <option value="zh_CN">简体中文</option>
        <option value="en_US">English</option>
      </select>
    </div>

    <div class="settings-row">
      <div class="settings-row__copy">
        <label for="theme-select">{{ t('settings.theme') }}</label>
        <p id="theme-description">{{ t('settings.theme_description') }}</p>
      </div>

      <select
        id="theme-select"
        :value="theme"
        aria-describedby="theme-description"
        @change="handleThemeChange"
      >
        <option value="system">{{ t('settings.theme_system') }}</option>
        <option value="light">{{ t('settings.theme_light') }}</option>
        <option value="dark">{{ t('settings.theme_dark') }}</option>
      </select>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n, useTheme, type Theme } from '@repo/composables';

type SupportedLanguage = 'zh_CN' | 'en_US';

const { t, language, changeLanguage } = useI18n();
const { theme, changeTheme } = useTheme();

function handleLanguageChange(event: Event) {
  const nextLanguage = (event.target as HTMLSelectElement).value as SupportedLanguage;
  void changeLanguage(nextLanguage);
}

function handleThemeChange(event: Event) {
  const nextTheme = (event.target as HTMLSelectElement).value as Theme;
  changeTheme(nextTheme);
}
</script>

<style scoped>
.settings-page {
  height: 100%;
  padding: var(--space-6);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.settings-page__header {
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

h1 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-5) 0;
}

.settings-row__copy label {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
}

.settings-row__copy p {
  margin: var(--space-2) 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

select {
  min-width: 168px;
  padding: var(--space-2) 30px var(--space-2) 10px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface-raised);
  color: var(--color-text-primary);
}

select:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .settings-page {
    padding: var(--space-4);
  }

  .settings-row {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--space-3);
  }

  select {
    width: 100%;
  }
}
</style>
