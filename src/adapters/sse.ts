export type SseEventHandler<T = unknown> = (data: T) => void;

export class SseClient {
  private eventSource: EventSource | null = null;
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(
    onMessage: SseEventHandler,
    onError?: (err: Event) => void
  ): void {
    if (this.eventSource) {
      this.disconnect();
    }

    this.eventSource = new EventSource(this.url);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e: unknown) {
        console.debug('SSE JSON parse fallback, using raw data', e);
        onMessage(event.data);
      }
    };

    if (onError) {
      this.eventSource.onerror = (event) => {
        onError(event);
      };
    }
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  get isConnected(): boolean {
    return this.eventSource !== null;
  }
}
