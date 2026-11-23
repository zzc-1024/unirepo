import { oc } from '@orpc/contract';
import { z } from 'zod';

import { ChatListSchema } from './chat.js';

/** 会话摘要：历史列表只需要标题和时间，避免一次传输全部消息 */
export const ConversationSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** 完整会话：包含全部聊天消息 */
export const ConversationSchema = ConversationSummarySchema.extend({
  messages: ChatListSchema,
});

export type ConversationSummary = z.infer<typeof ConversationSummarySchema>;
export type Conversation = z.infer<typeof ConversationSchema>;

export const listConversationsContract = oc.output(z.array(ConversationSummarySchema));

export const findConversationContract = oc
  .input(z.object({ id: z.string() }))
  .output(ConversationSchema.optional());

export const createConversationContract = oc
  .input(z.object({ title: z.string().default('') }))
  .output(ConversationSchema);

export const updateConversationContract = oc
  .input(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      messages: ChatListSchema.optional(),
    }),
  )
  .output(ConversationSchema.optional());

export const conversation = {
  list: listConversationsContract,
  find: findConversationContract,
  create: createConversationContract,
  update: updateConversationContract,
};
