import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SseClient } from '../../src/adapters/sse';

describe('SseClient', () => {
  const originalEventSource = (globalThis as any).EventSource;
  let mockEventSourceInstance: any;

  beforeEach(() => {
    mockEventSourceInstance = {
      close: vi.fn(),
      readyState: 1,
    };

    (globalThis as any).EventSource = vi.fn().mockImplementation(() => mockEventSourceInstance) as any;
  });

  afterEach(() => {
    (globalThis as any).EventSource = originalEventSource;
  });

  it('should instantiate and connect to EventSource', () => {
    const client = new SseClient('/stream');
    expect(client.isConnected).toBe(false);

    const onMessage = vi.fn();
    client.connect(onMessage);

    expect((globalThis as any).EventSource).toHaveBeenCalledWith('/stream');
    expect(client.isConnected).toBe(true);
  });

  it('should trigger onMessage with parsed JSON', () => {
    const client = new SseClient('/stream');
    const onMessage = vi.fn();
    client.connect(onMessage);

    const messageEvent = { data: JSON.stringify({ event: 'test', payload: 123 }) };
    mockEventSourceInstance.onmessage(messageEvent);

    expect(onMessage).toHaveBeenCalledWith({ event: 'test', payload: 123 });
  });

  it('should trigger onMessage with raw string if not JSON', () => {
    const client = new SseClient('/stream');
    const onMessage = vi.fn();
    client.connect(onMessage);

    const rawEvent = { data: 'plain text data' };
    mockEventSourceInstance.onmessage(rawEvent);

    expect(onMessage).toHaveBeenCalledWith('plain text data');
  });

  it('should call onError when EventSource fails', () => {
    const client = new SseClient('/stream');
    const onMessage = vi.fn();
    const onError = vi.fn();
    client.connect(onMessage, onError);

    const errorEvent = new Event('error');
    mockEventSourceInstance.onerror(errorEvent);

    expect(onError).toHaveBeenCalledWith(errorEvent);
  });

  it('should close EventSource on disconnect', () => {
    const client = new SseClient('/stream');
    client.connect(vi.fn());
    expect(client.isConnected).toBe(true);

    client.disconnect();
    expect(mockEventSourceInstance.close).toHaveBeenCalled();
    expect(client.isConnected).toBe(false);
  });

  it('should disconnect active connection if connect is called again', () => {
    const client = new SseClient('/stream');
    client.connect(vi.fn());

    const firstInstance = mockEventSourceInstance;

    client.connect(vi.fn());
    expect(firstInstance.close).toHaveBeenCalled();
  });
});
