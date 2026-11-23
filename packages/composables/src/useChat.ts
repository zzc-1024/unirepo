import { t } from '@repo/i18n';
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

    // 捕获当前数组：切换会话后 messages.value 会被替换，
    // 旧请求的流式回调不应再写入新会话的消息列表。
    const currentMessages = messages.value;

    // 1. 追加用户消息 & 预占 AI 气泡
    currentMessages.push({ role: 'user', content: trimmed });
    const aiIndex = currentMessages.length;
    currentMessages.push({ role: 'assistant', content: '' });

    // 2. 创建中断控制器
    abortController = new AbortController();
    loading.value = true;

    try {
      // 3. 通过 transport 接口调用，不关心具体实现
      await transport.stream(
        currentMessages,
        {
          onChunk: (chunk) => {
            currentMessages[aiIndex]!.content += chunk;
          },
          onComplete: () => {
            // 可在此处处理 metadata、token 计数等
          },
          onError: (err) => {
            // 非中断错误才显示提示
            if (err.name !== 'AbortError') {
              currentMessages[aiIndex]!.content =
                `⚠️ ${err.message || t('chat.error.request_failed')}`;
            }
          },
        },
        abortController.signal,
      );
    } catch (err) {
      // 兜底：如果 transport 没有正确处理 onError
      if (err instanceof Error && err.name !== 'AbortError') {
        currentMessages[aiIndex]!.content = `⚠️ ${t('chat.error.unknown')}`;
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

  /** 替换消息列表：用于切换会话或载入历史消息 */
  function setMessages(nextMessages: ChatMessage[]) {
    abort();
    messages.value = [...nextMessages];
  }

  return {
    messages,
    inputValue,
    loading,
    handleSend,
    clearMessages,
    setMessages,
    abort,
  };
}
