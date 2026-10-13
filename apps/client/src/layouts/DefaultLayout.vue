<script setup lang="ts">
import type { Component } from 'vue';
import { onMounted, shallowRef } from 'vue';

import { routeLoaders } from '@/router';
import type { RouteDefinition } from '@/router/routeTypes';

const availableRoutes = shallowRef<RouteDefinition[]>([]);
const currentComponent = shallowRef<Component | null>(null);
const activePath = shallowRef('/');

const navItems = [
  { label: 'Chat', path: '/' },
  { label: 'Settings', path: '/settings' },
];

async function loadRoutes(): Promise<void> {
  const modules = await Promise.all(
    Object.values(routeLoaders).map(async (loadRoute) => (await loadRoute()).default),
  );

  availableRoutes.value = modules;

  const initialRoute = modules.find((route) => route.path === activePath.value) ?? modules[0];
  if (initialRoute) {
    await navigateTo(initialRoute.path);
  }
}

async function navigateTo(path: string): Promise<void> {
  const matchedRoute = availableRoutes.value.find((route) => route.path === path);

  if (!matchedRoute) {
    return;
  }

  activePath.value = matchedRoute.path;
  const module = await matchedRoute.component();
  currentComponent.value = module.default;
}

onMounted(() => {
  void loadRoutes();
});
</script>

<template>
  <div class="layout-shell">
    <nav class="nav-bar" aria-label="Main navigation">
      <button
        v-for="item in navItems"
        :key="item.path"
        type="button"
        :class="{ active: activePath === item.path }"
        @click="navigateTo(item.path)"
      >
        {{ item.label }}
      </button>
    </nav>

    <main class="page-panel">
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
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  background: #0f172a;
}

.nav-bar button {
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  background: rgba(148, 163, 184, 0.15);
  color: #e2e8f0;
}

.nav-bar button.active {
  background: #2563eb;
  color: white;
}

.page-panel {
  flex: 1;
  min-height: 0;
}
</style>
