import { ref, type Ref } from 'vue';

import type { ChatMessage, UseChatOptions } from './types/chat';

export function useChat(options: UseChatOptions) {
  const { transport, initialMessages = [] } = options;

  // ── 响应式状态 ──
  const messages: Ref<ChatMessage[]> = ref([...initialMessages]);
  const inputValue = ref('');
  const loading = ref(false);

  // ── 内部控制器 ──
  let abortController: AbortController | null = null;

  // ── 发送消息 ──
  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading.value) return;

    // 1. 追加用户消息 & 预占 AI 气泡
    messages.value.push({ role: 'user', content: trimmed });
    const aiIndex = messages.value.length;
    messages.value.push({ role: 'assistant', content: '' });

    // 2. 创建中断控制器
    abortController = new AbortController();
    loading.value = true;

    try {
      // 3. 通过 transport 接口调用，不关心具体实现
      await transport.stream(
        messages.value,
        {
          onChunk: (chunk) => {
            messages.value[aiIndex]!.content += chunk;
          },
          onComplete: () => {
            // 可在此处处理 metadata、token 计数等
          },
          onError: (err) => {
            // 非中断错误才显示提示
            if (err.name !== 'AbortError') {
              messages.value[aiIndex]!.content = `⚠️ ${err.message || '请求失败'}`;
            }
          },
        },
        abortController.signal,
      );
    } catch (err) {
      // 兜底：如果 transport 没有正确处理 onError
      if (err instanceof Error && err.name !== 'AbortError') {
        messages.value[aiIndex]!.content = '⚠️ 未知错误';
      }
    } finally {
      loading.value = false;
      abortController = null;
    }
  }

  function abort() {
    abortController?.abort();
  }

  function clearMessages() {
    messages.value = [...initialMessages];
  }

  return {
    messages,
    inputValue,
    loading,
    handleSend,
    clearMessages,
    abort,
  };
}
