<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

import { RepoListbox } from '@repo/components';
import { docsPages, pageGroups } from './playground/registry';

const activePageId = ref(readHash());
const searchQuery = ref('');
const mobileNavigationOpen = ref(false);
const searchInput = useTemplateRef<HTMLInputElement>('searchInput');

const visibleGroups = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase();
  return pageGroups
    .map((group) => ({
      ...group,
      pages: group.pages.filter((page) =>
        `${page.title} ${page.summary}`.toLocaleLowerCase().includes(query),
      ),
    }))
    .filter((group) => group.pages.length > 0);
});
const navigationItems = computed(() =>
  visibleGroups.value.flatMap((group) =>
    group.pages.map((page) => ({ value: page.id, group: group.title })),
  ),
);
const navigationLabels = Object.fromEntries(docsPages.map((page) => [page.id, page.title]));
const navigationBadges = Object.fromEntries(
  docsPages.filter((page) => page.badge).map((page) => [page.id, page.badge]),
);

const activePage = computed(
  () => docsPages.find((page) => page.id === activePageId.value) ?? docsPages[0],
);

function readHash(): string {
  if (typeof window === 'undefined') return 'overview';
  return window.location.hash.slice(1) || 'overview';
}

function syncPageFromHash(): void {
  const requestedPageId = readHash();
  activePageId.value = docsPages.some((page) => page.id === requestedPageId)
    ? requestedPageId
    : 'overview';
  mobileNavigationOpen.value = false;
}

function navigateTo(pageId: string): void {
  if (activePageId.value === pageId) {
    mobileNavigationOpen.value = false;
    return;
  }
  window.location.hash = pageId;
}

function focusSearchOnSlash(event: KeyboardEvent): void {
  const target = event.target;
  if (
    event.key !== '/' ||
    (target instanceof HTMLElement &&
      (target.isContentEditable || target.matches('input, textarea, select')))
  ) {
    return;
  }
  event.preventDefault();
  searchInput.value?.focus();
}

onMounted(() => {
  window.addEventListener('hashchange', syncPageFromHash);
  window.addEventListener('keydown', focusSearchOnSlash);
});
onUnmounted(() => {
  window.removeEventListener('hashchange', syncPageFromHash);
  window.removeEventListener('keydown', focusSearchOnSlash);
});
</script>

<template>
  <div class="playground-shell">
    <header class="topbar">
      <button
        class="mobile-menu-button"
        type="button"
        :aria-label="mobileNavigationOpen ? '关闭导航' : '打开导航'"
        :aria-expanded="mobileNavigationOpen"
        @click="mobileNavigationOpen = !mobileNavigationOpen"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <a class="brand" href="#overview" @click="navigateTo('overview')">
        <span class="brand-mark" aria-hidden="true">R</span>
        <span class="brand-name">Repo UI</span>
        <span class="brand-divider"></span>
        <span class="brand-section">组件文档</span>
      </a>
      <div class="topbar-spacer"></div>
      <label class="search-box">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.2 4.2" />
        </svg>
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="search"
          placeholder="搜索组件"
          aria-label="搜索组件"
        />
        <kbd>/</kbd>
      </label>
      <a
        class="source-link"
        href="https://github.com/zzc-1024/unirepo"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 12 12 4M5 4h7v7" />
        </svg>
      </a>
    </header>

    <div class="docs-layout">
      <div
        v-if="mobileNavigationOpen"
        class="navigation-backdrop"
        @click="mobileNavigationOpen = false"
      ></div>
      <aside class="sidebar" :class="{ 'sidebar--open': mobileNavigationOpen }">
        <div class="sidebar-scroll">
          <nav class="sidebar-listbox" aria-label="组件文档导航">
            <RepoListbox
              :items="navigationItems"
              :labels="navigationLabels"
              :model-value="activePageId"
              @update:model-value="$event !== null && navigateTo(String($event))"
            >
              <template #item="{ item, label }">
                <span>{{ label }}</span>
                <span v-if="navigationBadges[item.value]" class="nav-badge">
                  {{ navigationBadges[item.value] }}
                </span>
              </template>
            </RepoListbox>
          </nav>
          <p v-if="visibleGroups.length === 0" class="search-empty">没有匹配的组件</p>
        </div>
        <div class="sidebar-footer">
          <span class="status-dot"></span>
          当前组件库 · Vue 3
        </div>
      </aside>

      <main class="doc-main">
        <div class="doc-content">
          <Suspense>
            <component :is="activePage?.component" :key="activePage?.id" />
            <template #fallback>
              <div class="page-loading" role="status">正在加载文档…</div>
            </template>
          </Suspense>
        </div>
        <footer class="doc-footer">
          <span>Repo UI · 组件使用文档</span>
          <span>由组件源码示例自动生成</span>
        </footer>
      </main>
    </div>
  </div>
</template>
