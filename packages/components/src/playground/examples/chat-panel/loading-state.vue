<script setup lang="ts">
import { ref } from 'vue';

import { ChatPanel } from '@repo/components';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  name?: string;
}

const messages = ref<ChatMessage[]>([
  { role: 'user', name: '你', content: '正在整理一份使用指南……' },
  { role: 'assistant', name: '助手', content: '' },
]);
const isLoading = ref(true);
const inputValue = ref('');

function cancelReply(): void {
  isLoading.value = false;
  messages.value[messages.value.length - 1] = {
    role: 'assistant',
    name: '助手',
    content: '已取消本次回复。',
  };
}

function submitMessage(text: string): void {
  messages.value.push({ role: 'user', name: '你', content: text });
  inputValue.value = '';
}
</script>

<template>
  <div class="chat-demo">
    <ChatPanel
      :messages="messages"
      :input-value="inputValue"
      :loading="isLoading"
      @cancel="cancelReply"
      @submit="submitMessage"
      @change="inputValue = $event"
    />
  </div>
</template>

<style scoped>
.chat-demo {
  height: 360px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #fff;
}
</style>
