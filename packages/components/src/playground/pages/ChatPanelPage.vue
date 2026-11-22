<script setup lang="ts">
import ComponentDocLayout from '../components/ComponentDocLayout.vue';
import { createExample } from '../examples';
import type { ReferenceItem } from '../types';

const examples = [
  createExample(
    'chat-panel/basic.vue',
    '基础对话',
    '展示消息历史，并将输入、提交和取消事件接入本地状态。',
  ),
  createExample(
    'chat-panel/loading-state.vue',
    '等待回复',
    '通过 loading 属性显示回复状态，点击取消结束当前等待。',
  ),
];

const props: ReferenceItem[] = [
  { name: 'messages', type: 'MessageItem[]', description: '聊天消息列表，支持 user 与 assistant 消息。' },
  { name: 'inputValue', type: 'string', description: '输入框当前内容。' },
  { name: 'loading', type: 'boolean', description: '是否处于等待回复状态。' },
];

const events: ReferenceItem[] = [
  { name: 'submit', type: '(payload: string) => void', description: '提交输入内容。' },
  { name: 'change', type: '(text: string) => void', description: '输入内容变化。' },
  { name: 'cancel', type: '() => void', description: '取消当前生成过程。' },
];
</script>

<template>
  <ComponentDocLayout
    title="ChatPanel 聊天面板"
    summary="为对话页面提供消息历史、输入框和生成中状态。"
    description="ChatPanel 负责对话内容的呈现与输入交互；消息发送和生成逻辑由父组件处理，便于接入不同的状态管理或后端服务。"
    import-path="import { ChatPanel } from '@repo/components';"
    :examples="examples"
    :props="props"
    :events="events"
    :slots="[]"
  />
</template>
