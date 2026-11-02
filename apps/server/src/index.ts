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

const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 3000);

if (!host.trim()) {
  throw new Error('HOST must not be empty.');
}

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

server.listen(port, host, () => console.log(`Listening on ${host}:${port}`));
