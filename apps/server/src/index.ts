import { createServer } from 'node:http';

import { implement } from '@orpc/server';
import { RPCHandler } from '@orpc/server/node';
import { CORSHandlerPlugin } from '@orpc/server/plugins';
import { contract } from '@repo/api';

import { chatRouter } from './chat.js';
import { modelProviderRouter } from './modelProvider.js';

const os = implement(contract);

export const router = os.router({
  modelProvider: modelProviderRouter,
  chat: chatRouter,
});

const handler = new RPCHandler(router, {
  plugins: [new CORSHandlerPlugin()],
});

const server = createServer(async (req, res) => {
  const { matched } = await handler.handle(req, res, { prefix: '/rpc' });

  if (matched) {
    return;
  }

  res.statusCode = 404;
  res.end('Not found');
});

server.listen(3000, '0.0.0.0', () => console.log('Listening on 0.0.0.0:3000'));
