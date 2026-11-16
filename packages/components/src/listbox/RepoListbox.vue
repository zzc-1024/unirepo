<script setup lang="ts">
import { ListboxContent, ListboxGroup, ListboxGroupLabel, ListboxItem, ListboxRoot } from 'reka-ui';
import { computed } from 'vue';

/** 列表项定义 */
export interface ListboxEntry {
  /** 唯一标识，同时作为选中值 */
  value: string | number;
  /** 可选：分组名，不传则归入无分组区域 */
  group?: string;
  /** 可选：禁用 */
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    /** 列表数据 */
    items: ListboxEntry[];
    /** 字典映射：value -> 展示文案（或任意对象，交由 slot 决定如何用） */
    labels?: Record<string | number, string>;
    /** 分组顺序（不传则按 items 中出现顺序） */
    groupOrder?: string[];
  }>(),
  { labels: () => ({}), groupOrder: undefined },
);

/** 按分组聚合，保持出现顺序；无 group 的归入 undefined 键 */
const grouped = computed(() => {
  const map = new Map<string | undefined, ListboxEntry[]>();
  for (const item of props.items) {
    const key = item.group;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  const isGroupKey = (key: string | undefined): key is string => key !== undefined;
  const keys = [...map.keys()].filter(isGroupKey);
  // 分组顺序：无分组区域放最后；有 groupOrder 则按其排序
  const { groupOrder } = props;
  const ordered: (string | undefined)[] = groupOrder
    ? [...groupOrder.filter((g) => map.has(g)), ...keys.filter((k) => !groupOrder.includes(k))]
    : keys;
  if (map.has(undefined)) ordered.push(undefined);
  return ordered.map((key) => ({ key, entries: map.get(key) ?? [] }));
});
</script>

<template>
  <ListboxRoot class="lb-root">
    <ListboxContent>
      <template v-for="section in grouped" :key="section.key ?? '__plain__'">
        <!-- 无分组区域：直接渲染 -->
        <template v-if="section.key === undefined">
          <ListboxItem
            v-for="item in section.entries"
            :key="item.value"
            :value="item.value"
            :disabled="item.disabled"
            class="lb-item"
          >
            <slot name="item" :item="item" :label="labels[item.value]">
              {{ labels[item.value] ?? item.value }}
            </slot>
          </ListboxItem>
        </template>

        <!-- 有分组区域 -->
        <ListboxGroup v-else>
          <ListboxGroupLabel class="lb-group-label">{{ section.key }}</ListboxGroupLabel>
          <ListboxItem
            v-for="item in section.entries"
            :key="item.value"
            :value="item.value"
            :disabled="item.disabled"
            class="lb-item"
          >
            <slot name="item" :item="item" :label="labels[item.value]">
              {{ labels[item.value] ?? item.value }}
            </slot>
          </ListboxItem>
        </ListboxGroup>
      </template>
    </ListboxContent>
  </ListboxRoot>
</template>

<style scoped>
/* 根容器 */
.lb-root {
  width: 12rem; /* w-48 */
  height: 18rem; /* h-72 */
  display: flex;
  flex-direction: column;
  padding: 0.25rem; /* p-1 */
  border-radius: 0.5rem; /* rounded-lg */
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #065f46;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
  box-sizing: border-box;
}

/* 列表项 */
.lb-item {
  width: 100%;
  padding: 0.25rem 0.5rem; /* py-1 px-2 */
  font-size: 0.875rem; /* text-sm */
  color: #065f46;
  user-select: none;
  border-radius: 0.25rem; /* rounded */
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background-color 0.12s,
    color 0.12s;
}

.lb-item[data-highlighted] {
  outline: 1px solid #065f46;
  outline-offset: -1px;
}

.lb-item:focus-visible {
  outline: 1px solid #065f46;
  outline-offset: -1px;
}

.lb-item[data-state='checked'] {
  background: #065f46;
  color: #ffffff;
}

.lb-item[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 分组标签 */
.lb-group-label {
  padding: 0.5rem 0.5rem 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  user-select: none;
}
</style>
