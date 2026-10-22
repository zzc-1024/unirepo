<template>
  <McLayout class="chat-layout">
    <McLayoutHeader>
      <McHeader :logo-img="logo" :title="t('name')"></McHeader>
    </McLayoutHeader>

    <McLayoutContent class="chat-content" :auto-scroll="true" :show-scroll-arrow="true">
      <template v-for="(item, index) in messages" :key="index">
        <!-- 用户消息 -->
        <McBubble
          v-if="item.role === 'user'"
          :content="item.content"
          :align="'right'"
          :avatar-config="{ imgSrc: item.avatar ?? '' }"
          :variant="'bordered'"
        >
          <template #top>
            <div style="text-align: right">
              <span>{{ item.name ?? t('chat.user') }}</span>
            </div>
          </template>
          <McMarkdownCard :content="item.content"></McMarkdownCard>
        </McBubble>

        <!-- AI消息 -->
        <McBubble
          v-else
          :content="item.content"
          :avatar-config="{ imgSrc: item.avatar ?? '' }"
          :variant="'bordered'"
          :loading="item.content == ''"
        >
          <template #top>
            <div>
              <span>{{ item.name ?? t('chat.assistant') }}</span>
            </div>
          </template>
          <McMarkdownCard
            :enable-think="true"
            :content="item.content"
            :typing="true"
            :typing-options="{ style: 'color', interval: 1 }"
          ></McMarkdownCard>
        </McBubble>
      </template>
    </McLayoutContent>

    <McLayoutSender>
      <McInput
        :value="inputValue"
        :max-length="2000"
        show-count
        :loading="loading"
        @submit="(payload: string) => emit('submit', payload)"
        @cancel="emit('cancel')"
        @change="(text: string) => emit('change', text)"
      ></McInput>
    </McLayoutSender>
  </McLayout>
</template>

<script setup lang="ts">
import {
  McBubble,
  McHeader,
  McInput,
  McLayout,
  McLayoutContent,
  McLayoutHeader,
  McLayoutSender,
  McMarkdownCard,
} from '@matechat/core';
import { logo } from '@repo/assets';
import { useI18n } from '@repo/composables';

// ================= 类型定义 =================
export interface MessageItem {
  role: 'user' | 'assistant' | string;
  content: string;
  name?: string;
  avatar?: string;
}

// ================= Props (接收数据) =================
defineProps<{
  /**
   * 聊天消息列表
   */
  messages: MessageItem[];
  /**
   * 输入框的值
   */
  inputValue: string;
  /**
   * 是否处于加载状态
   */
  loading: boolean;
}>();

// ================= Emits (派发事件) =================
const emit = defineEmits<{
  submit: [payload: string];
  cancel: [];
  change: [text: string];
}>();

const { t } = useI18n();
</script>

<style scoped>
/* ✅ 核心布局样式 */
.chat-layout {
  width: 100%;
  height: 100%; /* 撑满父容器 */
  padding: 0 20px;
  gap: 16px;
  display: flex; /* 确保 flex 纵向布局 */
  flex-direction: column;
  overflow: hidden; /* 防止整体溢出 */
}

/* ✅ 对话历史区域：自动填充剩余高度 */
.chat-content {
  flex: 1; /* 占据 Header 和 Sender 之外的所有空间 */
  min-height: 0; /* 关键！允许 flex 子项收缩以触发内部滚动 */
  overflow-y: auto;
}
</style>
