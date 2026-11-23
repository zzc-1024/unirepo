import { implement } from '@orpc/server';
import { contract } from '@repo/api';
import { v4 as uuidv4 } from 'uuid';

import { fakeConversationDB } from './database/conversationModel.js';

const os = implement(contract);

export const listConversations = os.conversation.list.handler(async () => {
  // replace with your database query
  return [...fakeConversationDB]
    .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
    .map(({ id, title, createdAt, updatedAt }) => ({ id, title, createdAt, updatedAt }));
});

export const findConversation = os.conversation.find.handler(async ({ input }) => {
  // replace with your database query
  return fakeConversationDB.find((conversation) => conversation.id === input.id);
});

export const createConversation = os.conversation.create.handler(async ({ input }) => {
  // replace with your database insert
  const timestamp = new Date();
  const newConversation = {
    id: uuidv4(),
    title: input.title ?? '',
    createdAt: timestamp,
    updatedAt: timestamp,
    messages: [],
  };

  fakeConversationDB.push(newConversation);
  return newConversation;
});

export const updateConversation = os.conversation.update.handler(async ({ input }) => {
  // replace with your database update
  const conversation = fakeConversationDB.find((item) => item.id === input.id);
  if (!conversation) return undefined;

  if (input.title !== undefined) {
    conversation.title = input.title;
  }
  if (input.messages !== undefined) {
    conversation.messages = input.messages;
  }
  conversation.updatedAt = new Date();

  return conversation;
});

export const conversationRouter = {
  list: listConversations,
  find: findConversation,
  create: createConversation,
  update: updateConversation,
};
