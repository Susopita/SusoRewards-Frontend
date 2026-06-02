import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../../src/adapters/api';
import { sessionStore } from '../../src/stores/session.svelte';

describe('ApiClient', () => {
  const originalFetch = (globalThis as any).fetch;

  beforeEach(() => {
    (globalThis as any).fetch = vi.fn();
    sessionStore.logout();
  });

  afterEach(() => {
    (globalThis as any).fetch = originalFetch;
  });

  it('should perform GET request and return JSON', async () => {
    const mockData = { success: true };
    ((globalThis as any).fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const client = new ApiClient('/test-api');
    const result = await client.get('/items');

    expect((globalThis as any).fetch).toHaveBeenCalledWith('/test-api/items', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(result).toEqual(mockData);
  });

  it('should include Authorization header when token is present', async () => {
    sessionStore.login({
      username: 'user',
      role: 'client',
      token: 'secret-token',
    });

    ((globalThis as any).fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const client = new ApiClient('/test-api');
    await client.get('/items');

    expect((globalThis as any).fetch).toHaveBeenCalledWith('/test-api/items', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer secret-token',
      },
    });
  });

  it('should throw error when HTTP response is not ok', async () => {
    ((globalThis as any).fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const client = new ApiClient('/test-api');
    await expect(client.get('/items')).rejects.toThrow('HTTP error! status: 404');
  });

  it('should perform POST request with body', async () => {
    const postBody = { name: 'New Item' };
    const responseBody = { id: 1, name: 'New Item' };
    ((globalThis as any).fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => responseBody,
    });

    const client = new ApiClient('/test-api');
    const result = await client.post('/items', postBody);

    expect((globalThis as any).fetch).toHaveBeenCalledWith('/test-api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    });
    expect(result).toEqual(responseBody);
  });
});
