<script setup lang="ts">
import type { ConversationSummary } from '@repo/api';
import { ChatPanel, RepoListbox } from '@repo/components';
import { useChat, useI18n } from '@repo/composables';
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';

import { client } from '@/client';
import { BackendTransport } from '@/transports/backendTransport';

/** 页面可用宽度低于该值时，历史列表收进抽屉 */
const COMPACT_BREAKPOINT = 640;

const { t } = useI18n();
const pageRef = useTemplateRef<HTMLElement>('pageRef');

/* ========== 会话列表 ========== */
const conversations = ref<ConversationSummary[]>([]);
const selectedConversationId = ref<string | null>(null);

/* ========== 响应式布局 ========== */
const isCompact = ref(false);
const isHistoryOpen = ref(false);
let resizeObserver: ResizeObserver | null = null;

function updateCompactState(width: number): void {
  const nextCompact = width < COMPACT_BREAKPOINT;
  if (nextCompact === isCompact.value) return;

  isCompact.value = nextCompact;
  if (!nextCompact) isHistoryOpen.value = false;
}

/* ========== 聊天状态 ========== */
const { messages, inputValue, loading, handleSend, abort, setMessages } = useChat({
  transport: new BackendTransport({ client, modelProviderId: '1' }),
  initialMessages: [],
});

/* ========== RepoListbox 数据 ========== */
const historyItems = computed(() => conversations.value.map((item) => ({ value: item.id })));

const historyLabels = computed<Record<string | number, string>>(() =>
  Object.fromEntries(
    conversations.value.map((item) => [
      item.id,
      item.title || t.value('chat.conversation.untitled'),
    ]),
  ),
);

/* ========== 会话操作 ========== */
async function refreshConversations(): Promise<void> {
  conversations.value = await client.conversation.list();
}

async function loadConversation(id: string): Promise<void> {
  try {
    const conversation = await client.conversation.find({ id });
    setMessages(conversation?.messages.map(({ role, content }) => ({ role, content })) ?? []);
  } catch (error) {
    console.error('[ChatPage] 加载会话失败：', error);
    setMessages([]);
  }
}

function handleSelectConversation(value: string | number | null): void {
  if (typeof value !== 'string' || value === selectedConversationId.value) return;

  selectedConversationId.value = value;
  isHistoryOpen.value = false;
  void loadConversation(value);
}

async function createConversation(): Promise<void> {
  try {
    const conversation = await client.conversation.create({ title: '' });
    selectedConversationId.value = conversation.id;
    setMessages([]);
    isHistoryOpen.value = false;
    await refreshConversations();
  } catch (error) {
    console.error('[ChatPage] 新建会话失败：', error);
  }
}

async function sendMessage(text: string): Promise<void> {
  const conversationId = selectedConversationId.value;
  if (!conversationId) return;

  const summary = conversations.value.find((item) => item.id === conversationId);
  const isFirstUserMessage = !messages.value.some((message) => message.role === 'user');

  // 等本轮流式回复结束后，再把消息写回内存数据库
  await handleSend(text);

  // 会话已切换时，不要把当前消息写到另一个会话
  if (selectedConversationId.value !== conversationId) return;

  const autoTitle =
    summary && !summary.title && isFirstUserMessage
      ? text.trim().slice(0, 24) || t.value('chat.conversation.untitled')
      : undefined;

  try {
    await client.conversation.update({
      id: conversationId,
      ...(autoTitle ? { title: autoTitle } : {}),
      messages: messages.value.map(({ role, content }) => ({
        role,
        content,
        timestamp: new Date(),
      })),
    });
    await refreshConversations();
  } catch (error) {
    console.error('[ChatPage] 保存会话失败：', error);
  }
}

/* ========== 生命周期 ========== */
onMounted(async () => {
  if (pageRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) updateCompactState(entry.contentRect.width);
    });
    resizeObserver.observe(pageRef.value);
    updateCompactState(pageRef.value.clientWidth);
  }

  try {
    await refreshConversations();
    const firstConversation = conversations.value[0];
    if (firstConversation) {
      selectedConversationId.value = firstConversation.id;
      await loadConversation(firstConversation.id);
    } else {
      await createConversation();
    }
  } catch (error) {
    console.error('[ChatPage] 初始化会话失败：', error);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  abort();
});
</script>

<template>
  <div ref="pageRef" class="chat-page" :class="{ 'chat-page--compact': isCompact }">
    <!-- 左侧：历史对话列表 -->
    <aside
      class="chat-page__history"
      :class="{ 'chat-page__history--open': isHistoryOpen }"
      :aria-hidden="isCompact && !isHistoryOpen"
    >
      <header class="history-header">
        <h2 class="history-header__title">{{ t('chat.conversation.history') }}</h2>
        <button
          type="button"
          class="history-header__new"
          :title="t('chat.conversation.new')"
          :aria-label="t('chat.conversation.new')"
          @click="createConversation()"
        >
          +
        </button>
      </header>

      <div class="history-list">
        <RepoListbox
          style="width: 100%; height: 100%; margin: 0"
          :items="historyItems"
          :labels="historyLabels"
          :model-value="selectedConversationId"
          @update:model-value="handleSelectConversation"
        >
          <template #item="{ label }">
            <span class="history-list__label">{{ label }}</span>
          </template>
        </RepoListbox>
      </div>
    </aside>

    <!-- 窄屏抽屉遮罩 -->
    <div
      v-if="isCompact && isHistoryOpen"
      class="chat-page__backdrop"
      @click="isHistoryOpen = false"
    ></div>

    <!-- 右侧：聊天面板 -->
    <section class="chat-page__main">
      <button
        v-if="isCompact"
        type="button"
        class="chat-page__toggle"
        :title="t('chat.conversation.toggle')"
        :aria-label="t('chat.conversation.toggle')"
        @click="isHistoryOpen = true"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <ChatPanel
        style="height: 100%"
        :messages="messages"
        :input-value="inputValue"
        :loading="loading"
        @submit="sendMessage"
        @change="(text) => (inputValue = text)"
        @cancel="abort"
      ></ChatPanel>
    </section>
  </div>
</template>

<style scoped>
.chat-page {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--color-surface);
}

/* ========== 左侧历史列表 ========== */
.chat-page__history {
  display: flex;
  flex: 0 0 240px;
  flex-direction: column;
  gap: var(--space-3);
  width: 240px;
  min-height: 0;
  padding: var(--space-3);
  border-right: 1px solid var(--color-border);
  background: var(--color-surface-muted);
  box-sizing: border-box;
}

.history-header {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: 0 var(--space-1);
}

.history-header__title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.history-header__new {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 1.125rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.history-header__new:hover {
  background: var(--color-accent-hover);
}

.history-list {
  flex: 1;
  min-height: 0;
}

.history-list__label {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* ========== 右侧聊天区域 ========== */
.chat-page__main {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.chat-page__toggle {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  z-index: 5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-md);
  background: var(--color-surface-raised);
  color: var(--color-text-secondary);
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.18);
  cursor: pointer;
}

.chat-page__toggle svg {
  width: 1.125rem;
  height: 1.125rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.chat-page__toggle:hover {
  color: var(--color-text-primary);
}

/* ========== 窄屏：历史列表变为抽屉 ========== */
.chat-page--compact .chat-page__history {
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 20;
  width: min(80%, 280px);
  transform: translateX(-100%);
  transition: transform var(--duration-normal) var(--ease-standard);
  box-shadow: var(--shadow-window);
}

.chat-page--compact .chat-page__history--open {
  transform: translateX(0);
}

.chat-page__backdrop {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(15, 23, 42, 0.35);
}
</style>
