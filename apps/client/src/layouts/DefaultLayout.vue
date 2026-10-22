<script setup lang="ts">
import { useI18n } from '@repo/composables';
import type { Component } from 'vue';
import { onMounted, shallowRef } from 'vue';

import { routeLoaders } from '@/router';
import type { RouteDefinition, RouteIcon } from '@/router/routeTypes';

const availableRoutes = shallowRef<RouteDefinition[]>([]);
const currentComponent = shallowRef<Component | null>(null);
const activePath = shallowRef<string | null>(null);
const isLoadingRoutes = shallowRef(true);
const navigationError = shallowRef('');
const { t } = useI18n();

let navigationId = 0;

function getIconPaths(icon: RouteIcon): string[] {
  if (icon.type !== 'svg') {
    return [];
  }

  const paths: string[] = [];
  icon.draw((pathData) => paths.push(pathData));
  return paths;
}

async function navigateTo(route: RouteDefinition): Promise<void> {
  const currentNavigationId = ++navigationId;
  navigationError.value = '';

  try {
    const module = await route.component();
    if (currentNavigationId === navigationId) {
      currentComponent.value = module.default;
      activePath.value = route.path;
    }
  } catch (cause) {
    if (currentNavigationId === navigationId) {
      navigationError.value = cause instanceof Error ? cause.message : String(cause);
    }
  }
}

async function loadRoutes(): Promise<void> {
  isLoadingRoutes.value = true;
  navigationError.value = '';

  try {
    const routes = await Promise.all(
      Object.values(routeLoaders).map(async (loadRoute) => (await loadRoute()).default),
    );
    routes.sort(
      (left, right) =>
        left.meta.rank - right.meta.rank || left.meta.name.localeCompare(right.meta.name),
    );

    if (routes.length === 0) {
      throw new Error('No routes were discovered.');
    }

    availableRoutes.value = routes;
    await navigateTo(routes[0]!);
  } catch (cause) {
    navigationError.value = cause instanceof Error ? cause.message : String(cause);
  } finally {
    isLoadingRoutes.value = false;
  }
}

onMounted(() => {
  void loadRoutes();
});
</script>

<template>
  <div class="layout-shell">
    <nav class="nav-bar" aria-label="Main navigation">
      <button
        v-for="route in availableRoutes"
        :key="route.path"
        type="button"
        :class="{ active: activePath === route.path }"
        :aria-current="activePath === route.path ? 'page' : undefined"
        @click="navigateTo(route)"
      >
        <svg
          v-if="route.meta.icon.type === 'svg'"
          class="nav-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            v-for="(pathData, index) in getIconPaths(route.meta.icon)"
            :key="index"
            :d="pathData"
          />
        </svg>
        <img v-else class="nav-icon" :src="route.meta.icon.value" alt="" />
        <span>{{ t(route.meta.name) }}</span>
      </button>
    </nav>

    <p v-if="isLoadingRoutes" class="status-message">Loading routes...</p>
    <p v-else-if="navigationError" class="status-message error-message" role="alert">
      {{ navigationError }}
    </p>
    <main v-else class="page-panel">
      <component :is="currentComponent" v-if="currentComponent" />
    </main>
  </div>
</template>

<style scoped>
.layout-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
}

.nav-bar {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-muted);
}

.nav-bar button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
  background: var(--color-surface-raised);
  color: var(--color-text-secondary);
}

.nav-bar button.active {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

.nav-icon {
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.status-message {
  padding: 16px;
  color: var(--color-text-secondary);
}

.error-message {
  color: var(--color-danger);
}

.page-panel {
  flex: 1;
  min-height: 0;
}
</style>
