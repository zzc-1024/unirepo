<script setup lang="ts">
import type { Component } from 'vue';
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';

import { routeLoaders } from './index';

const currentComponent = shallowRef<Component | undefined>(undefined);
const loading = shallowRef(true);
const error = shallowRef('');

let navigationId = 0;

async function loadCurrentRoute(): Promise<void> {
  const currentNavigationId = ++navigationId;
  loading.value = true;
  error.value = '';
  currentComponent.value = undefined;

  try {
    const routes = await Promise.all(
      Object.values(routeLoaders).map(async (loadRoute) => (await loadRoute()).default),
    );
    const route = routes.find((candidate) => candidate.path === window.location.pathname);

    if (!route) {
      throw new Error(`No route matches "${window.location.pathname}".`);
    }

    const component = (await route.component()).default;

    if (currentNavigationId === navigationId) {
      currentComponent.value = component;
    }
  } catch (cause) {
    if (currentNavigationId === navigationId) {
      error.value = cause instanceof Error ? cause.message : String(cause);
    }
  } finally {
    if (currentNavigationId === navigationId) {
      loading.value = false;
    }
  }
}

onMounted(() => {
  window.addEventListener('popstate', loadCurrentRoute);
  void loadCurrentRoute();
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', loadCurrentRoute);
});
</script>

<template>
  <p v-if="loading">Loading page...</p>
  <p v-else-if="error" role="alert">{{ error }}</p>
  <component :is="currentComponent" v-else-if="currentComponent" />
</template>
