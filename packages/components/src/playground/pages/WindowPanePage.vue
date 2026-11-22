<script setup lang="ts">
import ComponentDocLayout from '../components/ComponentDocLayout.vue';
import { createExample } from '../examples';
import type { ReferenceItem } from '../types';

const examples = [
  createExample(
    'window-pane/basic.vue',
    '可拖拽窗口',
    '拖动标题栏移动窗口，使用右下角缩放把手调整尺寸，标题栏按钮可最小化或关闭。',
  ),
  createExample(
    'window-pane/custom-icon.vue',
    '自定义标题栏图标',
    '通过 icon 插槽传入 SVG 图标，并使用 v-model:visible 管理窗口的显示状态。',
  ),
];

const props: ReferenceItem[] = [
  { name: 'title', type: 'string', description: '窗口标题。' },
  { name: 'visible', type: 'boolean', description: '控制窗口显示状态。', defaultValue: 'true' },
  { name: 'icon', type: 'string', description: '标题栏图标 URL。', defaultValue: "''" },
  { name: 'initialRect', type: 'Rect', description: '初始窗口位置和尺寸。', defaultValue: '{ x: 120, y: 100, width: 680, height: 440 }' },
  { name: 'minWidth', type: 'number', description: '窗口最小宽度。', defaultValue: '320' },
  { name: 'minHeight', type: 'number', description: '窗口最小高度。', defaultValue: '200' },
  { name: 'zIndex', type: 'number', description: '窗口层级。', defaultValue: '100' },
];

const events: ReferenceItem[] = [
  { name: 'update:visible', type: '(value: boolean) => void', description: '窗口显示状态变化，可用于 v-model:visible。' },
  { name: 'close', type: '() => void', description: '点击关闭按钮。' },
  { name: 'minimize', type: '() => void', description: '点击最小化按钮。' },
  { name: 'restore', type: '() => void', description: '从最小化状态还原。' },
  { name: 'focus', type: '() => void', description: '窗口获得焦点。' },
];

const slots: ReferenceItem[] = [
  { name: 'default', type: '—', description: '窗口主体内容。' },
  { name: 'icon', type: '—', description: '替换标题栏中的默认图标。' },
];
</script>

<template>
  <ComponentDocLayout
    title="WindowPane 桌面窗口"
    summary="带拖拽、缩放、最小化与最大化交互的窗口容器。"
    description="WindowPane 使用指针事件处理桌面和触屏交互；标题栏和内容区分离，父组件可以通过 visible 与公开的 restore 方法管理窗口生命周期。"
    import-path="import { WindowPane } from '@repo/components';"
    :examples="examples"
    :props="props"
    :events="events"
    :slots="slots"
  />
</template>
