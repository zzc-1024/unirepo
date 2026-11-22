<script setup lang="ts">
import ComponentDocLayout from '../components/ComponentDocLayout.vue';
import { createExample } from '../examples';
import type { ReferenceItem } from '../types';

const examples = [
  createExample(
    'repo-listbox/grouped.vue',
    '分组与禁用项',
    '通过 group 与 groupOrder 控制分组和显示顺序，单项可设置 disabled。',
  ),
  createExample(
    'repo-listbox/custom-item.vue',
    '自定义选项内容',
    '使用 item 插槽组合标签、说明文字和状态标记。',
  ),
];

const props: ReferenceItem[] = [
  { name: 'items', type: 'ListboxEntry[]', description: '列表项，包含 value，可选 group 与 disabled。' },
  { name: 'labels', type: 'Record<string | number, string>', description: 'value 到显示文案的映射。', defaultValue: '{}' },
  { name: 'groupOrder', type: 'string[]', description: '分组排序；未指定的分组按出现顺序追加。' },
  { name: 'modelValue', type: 'string | number | null', description: '当前选中项的值；提供后可通过 update:modelValue 接收变更。' },
];

const slots: ReferenceItem[] = [
  { name: 'item', type: '{ item, label }', description: '自定义选项内容；item 为列表项，label 为映射文案。' },
];

const events: ReferenceItem[] = [
  { name: 'update:modelValue', type: '(value: string | number | null) => void', description: '用户选择其他列表项时触发。' },
];
</script>

<template>
  <ComponentDocLayout
    title="RepoListbox 列表选择"
    summary="支持分组、禁用状态和自定义选项模板的列表选择器。"
    description="RepoListbox 基于 Reka UI Listbox 构建，支持分组、标签映射和可选的受控选中值。"
    import-path="import { RepoListbox } from '@repo/components';"
    :examples="examples"
    :props="props"
    :events="events"
    :slots="slots"
  />
</template>
