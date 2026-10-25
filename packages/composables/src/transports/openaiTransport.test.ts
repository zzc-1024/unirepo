import { beforeEach, describe, expect, it, vi } from 'vitest';

// vi.mock 工厂会提升到导入之前；用 vi.hoisted 提前创建工厂需要的 mock 函数。
const openAIMocks = vi.hoisted(() => ({
  create: vi.fn(),
}));

// 替换 OpenAI 客户端，保证测试只验证请求与回调，不会访问真实网络。
vi.mock('openai', () => ({
  default: vi.fn(function OpenAI() {
    return { chat: { completions: { create: openAIMocks.create } } };
  }),
}));

import { OpenAITransport } from './openaiTransport';

describe('OpenAITransport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('转发流式文本片段，并在读取完成后触发完成回调', async () => {
    async function* chunks() {
      yield { choices: [{ delta: { content: '你好' } }] };
      yield { choices: [{ delta: { content: '，世界' } }] };
      yield { choices: [{ delta: {} }] };
    }
    openAIMocks.create.mockResolvedValue(chunks());
    const transport = new OpenAITransport('key', 'https://example.test', 'model');
    const callbacks = { onChunk: vi.fn(), onComplete: vi.fn(), onError: vi.fn() };
    const signal = new AbortController().signal;
    const messages = [{ role: 'user' as const, content: 'Hi' }];

    await transport.stream(messages, callbacks, signal);

    expect(openAIMocks.create).toHaveBeenCalledWith(
      { model: 'model', messages, stream: true, temperature: 0.7 },
      { signal },
    );
    expect(callbacks.onChunk.mock.calls).toEqual([['你好'], ['，世界']]);
    expect(callbacks.onComplete).toHaveBeenCalledOnce();
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it('通过错误回调报告请求失败', async () => {
    const failure = new Error('网络请求失败');
    openAIMocks.create.mockRejectedValue(failure);
    const transport = new OpenAITransport('key', 'https://example.test', 'model');
    const callbacks = { onChunk: vi.fn(), onComplete: vi.fn(), onError: vi.fn() };

    await transport.stream([], callbacks, new AbortController().signal);

    expect(callbacks.onError).toHaveBeenCalledWith(failure);
    expect(callbacks.onChunk).not.toHaveBeenCalled();
    expect(callbacks.onComplete).not.toHaveBeenCalled();
  });
});
