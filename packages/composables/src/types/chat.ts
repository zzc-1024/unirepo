/** 标准消息格式 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** 流式回调上下文 */
export interface StreamCallbacks {
  /** 收到文本增量时触发 */
  onChunk: (chunk: string) => void;
  /** 流正常结束时触发（可选，用于获取 token 统计等元数据） */
  onComplete?: () => void;
  onError: (error: Error) => void;
}

/** useChat 与底层传输实现之间的契约 */
export interface ChatTransport {
  stream(messages: ChatMessage[], callbacks: StreamCallbacks, signal: AbortSignal): Promise<void>;
}

/** useChat 配置项 */
export interface UseChatOptions {
  transport: ChatTransport;
  initialMessages?: ChatMessage[];
}
