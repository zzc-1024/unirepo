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
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '@repo/composables';

type SupportedLanguage = 'zh_CN' | 'en_US';

const { t, language, changeLanguage } = useI18n();

function handleLanguageChange(event: Event) {
  const nextLanguage = (event.target as HTMLSelectElement).value as SupportedLanguage;
  void changeLanguage(nextLanguage);
}
</script>

<style scoped>
.settings-page {
  height: 100%;
  padding: 24px;
  background: #111827;
  color: #fff;
}

.settings-page__header {
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}

h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 0;
}

.settings-row__copy label {
  font-size: 14px;
  font-weight: 500;
}

.settings-row__copy p {
  margin: 6px 0 0;
  color: #aab4c4;
  font-size: 13px;
}

select {
  min-width: 168px;
  padding: 8px 30px 8px 10px;
  border: 1px solid #526075;
  border-radius: 4px;
  background: #1f2937;
}

select:focus-visible {
  outline: 2px solid #8ab4f8;
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .settings-page {
    padding: 18px;
  }

  .settings-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  select {
    width: 100%;
  }
}
</style>
