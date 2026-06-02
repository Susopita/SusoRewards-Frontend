import '@testing-library/jest-dom';

class MockEventSource {
  onmessage: any;
  onerror: any;
  constructor(public url: string) {}
  close() {}
}

if (typeof window !== 'undefined' && !window.EventSource) {
  (window as any).EventSource = MockEventSource;
  (global as any).EventSource = MockEventSource;
}

global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  return {
    ok: true,
    status: 200,
    json: async () => ({})
  } as Response;
};
