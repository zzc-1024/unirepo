<script setup lang="ts">
import { ref } from 'vue';

import { ChatPanel } from '@repo/components';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  name?: string;
}

defineOptions({ name: 'ChatPanelBasicExample' });

const messages = ref<ChatMessage[]>([
  { role: 'assistant', name: '助手', content: '你好！我可以帮你查找组件用法。' },
  { role: 'user', name: '你', content: 'RepoTable 如何自定义单元格？' },
  { role: 'assistant', name: '助手', content: '为列配置 render 函数，并返回文本或 Vue 节点即可。' },
]);
const inputValue = ref('');
const loading = ref(false);

function submitMessage(text: string): void {
  if (!text.trim()) return;
  messages.value.push({ role: 'user', name: '你', content: text });
  inputValue.value = '';
}
</script>

<template>
  <div class="chat-demo">
    <ChatPanel
      :messages="messages"
      :input-value="inputValue"
      :loading="loading"
      @change="inputValue = $event"
      @submit="submitMessage"
      @cancel="loading = false"
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
