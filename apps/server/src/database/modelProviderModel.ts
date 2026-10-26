import type { ModelProviderSchema } from '@repo/api';
import { z } from 'zod';

/**
 * 默认模型服务配置
 *
 * 通过环境变量注入，避免把密钥写进源码；
 * E2E 通过覆盖这些变量把请求指向本地替身上游。
 */
const DEFAULT_BASE_URL = process.env.OPENAI_BASE_URL ?? 'https://api.deepseek.com';
const DEFAULT_API_KEY = process.env.OPENAI_API_KEY ?? '';
const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'deepseek-flash';

export const fakeDB: z.infer<typeof ModelProviderSchema>[] = [
  {
    id: '1',
    name: 'Earth',
    description: 'Our home planet',
    baseUrl: DEFAULT_BASE_URL,
    apiKey: DEFAULT_API_KEY,
    model: DEFAULT_MODEL,
  },
  {
    id: '2',
    name: 'Mars',
    description: 'The red planet',
    baseUrl: 'https://api.mars.com',
    apiKey: 'key2',
    model: 'model2',
  },
];
