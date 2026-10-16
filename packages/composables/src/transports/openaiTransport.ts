import OpenAI from 'openai';

import type { ChatTransport, ChatMessage, StreamCallbacks } from '../types/chat';

export class OpenAITransport implements ChatTransport {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, baseURL: string, model: string) {
    this.client = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true });
    this.model = model;
  }

  async stream(
    messages: ChatMessage[],
    callbacks: StreamCallbacks,
    signal: AbortSignal,
  ): Promise<void> {
    try {
      const stream = await this.client.chat.completions.create(
        { model: this.model, messages, stream: true, temperature: 0.7 },
        { signal },
      );

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? '';
        if (delta) callbacks.onChunk(delta);
      }
      callbacks.onComplete?.();
    } catch (err) {
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
