import { defineAsyncComponent, type Component } from 'vue';

import type { DocsPage, DocsPageGroup } from './types';

const pageModules = import.meta.glob<{ default: Component }>('./pages/*.vue');

function loadPage(path: string): Component {
  const loader = pageModules[path];
  if (!loader) throw new Error(`Playground page not found: ${path}`);
  return defineAsyncComponent(loader);
}

const overview: DocsPage = {
  id: 'overview',
  title: '快速开始',
  summary: '浏览组件与交互示例',
  component: loadPage('./pages/OverviewPage.vue'),
};

const components: DocsPage[] = [
  {
    id: 'chat-panel',
    title: 'ChatPanel 聊天面板',
    summary: '消息列表、输入框和流式交互',
    component: loadPage('./pages/ChatPanelPage.vue'),
    badge: 'Chat',
  },
  {
    id: 'window-pane',
    title: 'WindowPane 桌面窗口',
    summary: '可拖拽、缩放、最大化的窗口容器',
    component: loadPage('./pages/WindowPanePage.vue'),
  },
  {
    id: 'desktop-view',
    title: 'DesktopView 桌面视图',
    summary: '应用图标选择和双击打开',
    component: loadPage('./pages/DesktopViewPage.vue'),
  },
  {
    id: 'repo-listbox',
    title: 'RepoListbox 列表选择',
    summary: '分组、禁用项和自定义选项模板',
    component: loadPage('./pages/RepoListboxPage.vue'),
  },
  {
    id: 'repo-table',
    title: 'RepoTable 数据表格',
    summary: '类型安全列配置和自定义单元格',
    component: loadPage('./pages/RepoTablePage.vue'),
  },
];

export const docsPages = [overview, ...components];

export const pageGroups: DocsPageGroup[] = [
  { title: '开始使用', pages: [overview] },
  { title: '基础组件', pages: components },
];
