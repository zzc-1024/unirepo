import { changeLanguage } from '@repo/i18n';
import { describe, expect, it, vi } from 'vitest';

import type { ChatTransport } from './types/chat';
import { useChat } from './useChat';

// 创建假 transport：只实现 stream，并用 vi.fn 包一层，方便断言调用次数和参数。
// 测试不关心真实网络流，只关心 useChat 如何与 transport 契约交互。
function createTransport(implementation: ChatTransport['stream']): ChatTransport {
  return { stream: vi.fn(implementation) };
}

describe('useChat', () => {
  it('复制初始消息，并发送去除首尾空白的文本及拼接流式内容', async () => {
    // 初始消息用 assistant 角色，便于和后面新增的消息区分。
    const initialMessages = [{ role: 'assistant' as const, content: '你好' }];
    // 假 transport：同步回调两个 chunk 和 onComplete，模拟一次立即完成的流式响应。
    const transport = createTransport(async (_messages, callbacks) => {
      callbacks.onChunk('你');
      callbacks.onChunk('好');
      callbacks.onComplete?.();
    });
    const chat = useChat({ transport, initialMessages });

    // 传入带首尾空白的文本，期望被 trim 成 '问题'。
    await chat.handleSend('  问题  ');

    // 消息列表：初始 assistant + 用户消息 + 流式拼接出的 assistant。
    expect(chat.messages.value).toEqual([
      { role: 'assistant', content: '你好' },
      { role: 'user', content: '问题' },
      { role: 'assistant', content: '你好' },
    ]);
    // 初始化时拷贝了 initialMessages，而不是直接引用外部数组。
    expect(chat.messages.value).not.toBe(initialMessages);
    // objectContaining 只要求回调对象包含指定属性；any 用于匹配具体类型的参数。
    // 注意：第一个参数与 chat.messages.value 是同一个数组引用（实现会原地修改它），
    // 因此这条断言只能证明“传入了消息数组”，无法校验调用瞬间的内容。
    expect(transport.stream).toHaveBeenCalledWith(
      chat.messages.value,
      expect.objectContaining({ onChunk: expect.any(Function) }),
      expect.any(AbortSignal),
    );
    // 流结束后 loading 必须复位。
    expect(chat.loading.value).toBe(false);
  });

  it('忽略空白消息，并阻止请求进行时重复发送', async () => {
    // finishStream 在 Promise executor 中被同步赋值：只要 stream 被调用过，
    // 它就一定是可调用的 resolve 函数。! 用于告诉 TS“保证使用前已赋值”。
    let finishStream!: () => void;
    // 假 transport 返回一个永远 pending 的 Promise，把请求“卡住”，
    // 从而让 loading 保持 true，制造一个稳定的“请求进行中”测试窗口。
    const transport = createTransport(
      () =>
        new Promise<void>((resolve) => {
          finishStream = resolve; // 先存下 resolve，稍后手动结束这次请求
        }),
    );
    const chat = useChat({ transport });

    // 1) 纯空白文本：trim 后为空，应直接 return，不发起请求。
    await chat.handleSend('   ');
    // 2) 发起第一条真实消息。故意不 await：请求会一直 pending，
    //    await 会死锁，所以先接住 Promise。此调用会在第一个 await 之前
    //    同步完成“追加消息 + loading = true”。
    const firstSend = chat.handleSend('第一条');
    // 3) 请求进行中再次发送：loading 为 true，应被直接忽略。
    //    该分支返回已 resolve 的 Promise，所以这里的 await 不会卡住。
    await chat.handleSend('第二条');

    // 空白消息和重复消息都没触发请求，所以 stream 只应被调用 1 次。
    expect(transport.stream).toHaveBeenCalledTimes(1);
    // 用户消息已入列；'' 是预占的 AI 气泡，等待 onChunk 填充（本次没有 chunk）。
    expect(chat.messages.value.map(({ content }) => content)).toEqual(['第一条', '']);

    // 收尾：手动结束 pending 请求，并等待第一个 handleSend 真正完成，
    // 让 finally 执行（loading 复位），避免留下悬挂的 Promise。
    finishStream();
    await firstSend;
  });

  it('显示传输层通过错误回调报告的异常', async () => {
    // 走 transport 契约里的 onError 分支：错误应写入 AI 气泡。
    const transport = createTransport(async (_messages, callbacks) => {
      callbacks.onError(new Error('服务不可用'));
    });
    const chat = useChat({ transport });

    await chat.handleSend('问题');

    // 最后一条消息（AI 气泡）应显示带 ⚠️ 前缀的错误信息。
    expect(chat.messages.value.at(-1)?.content).toBe('⚠️ 服务不可用');
    // 出错后 loading 也必须复位。
    expect(chat.loading.value).toBe(false);
  });

  it('为传输层意外抛出的异常显示兜底提示', async () => {
    // 这次 transport 不调用 onError，而是直接 throw，
    // 用于覆盖 useChat 内部 catch 分支的兜底提示。
    const transport = createTransport(async () => {
      throw new Error('意外错误');
    });
    const chat = useChat({ transport });

    await chat.handleSend('问题');

    // 注意：实现的 catch 分支固定显示“未知错误”，不会透出 err.message。
    expect(chat.messages.value.at(-1)?.content).toBe('⚠️ 未知错误');
    expect(chat.loading.value).toBe(false);
  });

  it('中止当前请求，并在清空后恢复初始消息', async () => {
    let finishStream!: () => void;
    // 保存 transport 收到的 signal，供测试断言“是否真的被 abort”。
    let requestSignal: AbortSignal | undefined;
    const initialMessages = [{ role: 'system' as const, content: 'Context' }];
    // 本用例不发 chunk，只关注中断与清空：
    // 模拟真实 transport 对中断的响应——收到 abort 后结束 Promise。
    const transport = createTransport(
      (_messages, _callbacks, signal) =>
        new Promise<void>((resolve) => {
          finishStream = resolve;
          requestSignal = signal;
          signal.addEventListener('abort', () => resolve(), { once: true });
        }),
    );
    const chat = useChat({ transport, initialMessages });

    // 同样不 await：请求要等 abort 或 finishStream 才结束。
    const send = chat.handleSend('问题');

    // abort() 应把中止信号透传给 transport。
    chat.abort();
    expect(requestSignal?.aborted).toBe(true);

    // 清空应恢复到初始消息（toEqual 只比较内容，不校验引用）。
    chat.clearMessages();
    expect(chat.messages.value).toEqual(initialMessages);

    // 收尾：结束 pending 请求并等待 handleSend 完成，确认 loading 复位。
    finishStream();
    await send;
    expect(chat.loading.value).toBe(false);
  });

  it('按当前语言输出错误文案', async () => {
    // i18next 默认语言为 zh_CN，切到 en_US 验证文案确实来自翻译资源。
    await changeLanguage('en_US');
    try {
      // 1) catch 兜底分支：使用 chat.error.unknown。
      const thrownTransport = createTransport(async () => {
        throw new Error('boom');
      });
      const thrownChat = useChat({ transport: thrownTransport });
      await thrownChat.handleSend('问题');
      expect(thrownChat.messages.value.at(-1)?.content).toBe('⚠️ Unknown error');

      // 2) onError 且错误没有 message 时：回退到 chat.error.request_failed。
      const emptyMessageTransport = createTransport(async (_messages, callbacks) => {
        callbacks.onError(new Error(''));
      });
      const emptyMessageChat = useChat({ transport: emptyMessageTransport });
      await emptyMessageChat.handleSend('问题');
      expect(emptyMessageChat.messages.value.at(-1)?.content).toBe('⚠️ Request failed');
    } finally {
      // 恢复默认语言，避免影响同文件后续用例。
      await changeLanguage('zh_CN');
    }
  });
});
