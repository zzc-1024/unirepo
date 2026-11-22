<script setup lang="ts">
import ComponentDocLayout from '../components/ComponentDocLayout.vue';
import { createExample } from '../examples';
import type { ReferenceItem } from '../types';

const examples = [
  createExample(
    'desktop-view/basic.vue',
    '桌面图标与选择',
    '单击图标选中，双击图标触发 openApp；点击桌面空白处清除选中。',
  ),
  createExample(
    'desktop-view/custom-apps.vue',
    '自定义应用集合',
    '为不同应用配置图标、颜色和名称，并在父级接收打开事件。',
  ),
];

const props: ReferenceItem[] = [
  { name: 'apps', type: 'AppDef[]', description: '桌面应用列表，包含 id、name、color 与 SVG path 数据。' },
];

const events: ReferenceItem[] = [
  { name: 'openApp', type: '(id: string) => void', description: '双击应用图标时触发。' },
];
</script>

<template>
  <ComponentDocLayout
    title="DesktopView 桌面视图"
    summary="以图标网格呈现桌面应用，支持选中与双击打开。"
    description="应用图标使用 SVG path 数据绘制，应用信息通过 apps 属性传入。组件不承担路由或窗口管理，openApp 事件由父级接管。"
    import-path="import { DesktopView } from '@repo/components';"
    :examples="examples"
    :props="props"
    :events="events"
    :slots="[]"
  />
</template>
