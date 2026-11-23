import type { Conversation } from '@repo/api';

/**
 * 会话内存数据库
 *
 * 与 modelProviderModel 中的 fakeDB 一样，这里只是开发阶段的模拟实现：
 * 数据保存在进程内存中，服务重启后会恢复为下面的初始数据。
 * TODO: 数据库方案确定后，把这里替换为真实的持久化查询。
 */
export type ConversationRecord = Conversation;

const minutesAgo = (minutes: number): Date => new Date(Date.now() - minutes * 60_000);

export const fakeConversationDB: ConversationRecord[] = [
  {
    id: 'seed-welcome',
    title: '欢迎使用 UniRepo',
    createdAt: minutesAgo(120),
    updatedAt: minutesAgo(90),
    messages: [
      {
        role: 'user',
        content: '这个项目是做什么的？',
        timestamp: minutesAgo(120),
      },
      {
        role: 'assistant',
        content:
          'UniRepo 是一个基于 Vue 3 的 monorepo 项目，包含桌面式布局、组件库、组合式函数和后端 oRPC 服务。',
        timestamp: minutesAgo(119),
      },
    ],
  },
  {
    id: 'seed-layout',
    title: '左右布局讨论',
    createdAt: minutesAgo(60),
    updatedAt: minutesAgo(30),
    messages: [
      {
        role: 'user',
        content: '对话页面适合用什么布局？',
        timestamp: minutesAgo(60),
      },
      {
        role: 'assistant',
        content: '可以做左右布局：左侧展示历史会话列表，右侧展示聊天内容，窄屏时把列表收进抽屉。',
        timestamp: minutesAgo(59),
      },
    ],
  },
];
