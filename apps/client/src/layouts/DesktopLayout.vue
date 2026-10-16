<template>
  <!-- 动态窗口：仅打开的应用才渲染，关闭即卸载 -->
  <WindowPane
    v-for="win in openWindows"
    :key="win.id"
    :ref="(instance) => registerPane(win.id, instance)"
    :title="getAppName(win.id)"
    :z-index="getZIndex(win.id)"
    @focus="bringToFront(win.id)"
    @close="closeApp(win.id)"
  >
    <component :is="getAppComponent(win.id)" />
  </WindowPane>
  <DesktopView :apps="apps" @open-app="openApp" />
</template>

<script setup lang="ts">
import { DesktopView, WindowPane } from '@repo/components';
import { useI18n } from '@repo/composables';
import type { AppDef } from '@repo/composables';
import { computed, defineAsyncComponent, markRaw, onMounted, ref, type Component } from 'vue';

import { routeLoaders } from '@/router';
import type { RouteDefinition, RouteIcon } from '@/router/routeTypes';

/* ========== 应用注册表：路由 → 桌面应用 ========== */
/** 应用图标底色（按路由顺序循环取用） */
const APP_COLORS = ['#2563eb', '#7e22ce', '#0d9488', '#ea580c', '#16a34a', '#db2777'];

/** 从路由图标中收集 SVG path 数据（与 DefaultLayout 的渲染方式一致） */
function getIconPaths(icon: RouteIcon): string[] {
  if (icon.type !== 'svg') return [];

  const paths: string[] = [];
  icon.draw((pathData) => paths.push(pathData));
  return paths;
}

/** 桌面图标数据 */
const routes = ref<RouteDefinition[]>([]);
const { t } = useI18n();
const apps = computed<AppDef[]>(() =>
  routes.value.map((route, index) => ({
    id: route.path,
    name: t.value(route.meta.name),
    color: APP_COLORS[index % APP_COLORS.length] ?? '#2563eb',
    icon: getIconPaths(route.meta.icon),
  })),
);
/** 窗口内容组件表：id（路由 path）→ 懒加载页面组件 */
const appComponents: Record<string, Component> = {};

function getAppComponent(id: string): Component | null {
  return appComponents[id] ?? null;
}

function getAppName(id: string): string {
  return apps.value.find((app) => app.id === id)?.name ?? '';
}

/** 加载路由注册表：新增路由 = 桌面自动多一个图标，窗口内渲染对应页面 */
async function loadApps(): Promise<void> {
  try {
    const loadedRoutes = await Promise.all(
      Object.values(routeLoaders).map(async (loadRoute) => (await loadRoute()).default),
    );
    loadedRoutes.sort(
      (left, right) =>
        left.meta.rank - right.meta.rank || left.meta.name.localeCompare(right.meta.name),
    );

    routes.value = loadedRoutes;
    loadedRoutes.forEach((route) => {
      appComponents[route.path] = markRaw(defineAsyncComponent(route.component));
    });
  } catch (error) {
    console.error('[DesktopLayout] 加载路由失败：', error);
  }
}

onMounted(() => {
  void loadApps();
});

/* ========== 窗口状态管理 ========== */
interface OpenWindow {
  id: string;
}

const openWindows = ref<OpenWindow[]>([]);

/**
 * 有序焦点栈：索引越大 = 越靠前
 * 用数组而非计数器，保证 zIndex 始终紧凑、不会无限增长
 */
const focusOrder = ref<string[]>([]);
const Z_BASE = 100;

function getZIndex(id: string): number {
  const idx = focusOrder.value.indexOf(id);
  return idx === -1 ? Z_BASE : Z_BASE + idx;
}

/** 将指定窗口移至栈顶（最后聚焦） */
function bringToFront(id: string): void {
  const stack = focusOrder.value;
  const idx = stack.indexOf(id);
  if (idx === -1 || idx === stack.length - 1) return;
  // 移除旧位置，推入末尾 → 触发响应式更新 → 所有窗口 zIndex 重算
  stack.splice(idx, 1);
  stack.push(id);
}

/** 已挂载窗口实例表：重新打开被最小化的窗口时调用其 expose 的 restore() */
const paneRefs = new Map<string, { restore: () => void }>();

function registerPane(id: string, instance: unknown): void {
  if (instance) {
    paneRefs.set(id, instance as { restore: () => void });
  } else {
    paneRefs.delete(id);
  }
}

function openApp(id: string): void {
  // 已打开 → 不重复添加：恢复最小化状态（若有）并聚焦
  if (openWindows.value.some((w) => w.id === id)) {
    bringToFront(id);
    paneRefs.get(id)?.restore();
    return;
  }

  const app = apps.value.find((a) => a.id === id);
  if (!app) return;

  openWindows.value.push({ id });
  // 新窗口自动置顶
  focusOrder.value.push(id);
}

function closeApp(id: string): void {
  const idx = openWindows.value.findIndex((w) => w.id === id);
  if (idx !== -1) openWindows.value.splice(idx, 1);
  // 同步清理焦点栈，避免残留 / 重复 id 破坏后续 zIndex 计算
  const zi = focusOrder.value.indexOf(id);
  if (zi !== -1) focusOrder.value.splice(zi, 1);
  // splice 移除后 v-for 中该 WindowPane 被销毁 → 内部异步组件实例卸载 → 资源释放
}
</script>

<style scoped></style>
