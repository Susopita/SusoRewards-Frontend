import { describe, it, expect, beforeEach } from 'vitest';
import { sessionStore } from '../../src/stores/session.svelte';

describe('SessionStore', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStore.logout();
  });

  it('should initialize with no active session', () => {
    expect(sessionStore.current).toBeNull();
    expect(sessionStore.isAuthenticated).toBe(false);
    expect(sessionStore.restaurantCode).toBeNull();
  });

  it('should set current session on login', () => {
    sessionStore.login({
      username: 'test_restaurant',
      role: 'restaurant',
      restaurantCode: 'REST123',
      token: 'jwt-token-123'
    });

    expect(sessionStore.current).toEqual({
      username: 'test_restaurant',
      role: 'restaurant',
      restaurantCode: 'REST123',
      token: 'jwt-token-123',
      expiresAt: expect.any(Number)
    });
    expect(sessionStore.isAuthenticated).toBe(true);
    expect(sessionStore.restaurantCode).toBe('REST123');
  });

  it('should clear session on logout', () => {
    sessionStore.login({
      username: 'test_client',
      role: 'client',
      token: 'jwt-token-456'
    });

    expect(sessionStore.isAuthenticated).toBe(true);
    expect(sessionStore.restaurantCode).toBeNull();

    sessionStore.logout();
    expect(sessionStore.current).toBeNull();
    expect(sessionStore.isAuthenticated).toBe(false);
  });

  it('should save session to localStorage on login and clear it on logout', () => {
    const session = {
      username: 'store_user',
      role: 'admin' as const,
      token: 'token-abc'
    };
    sessionStore.login(session);
    
    const saved = JSON.parse(localStorage.getItem('susorewards_session') || '{}');
    expect(saved.username).toBe(session.username);
    expect(saved.role).toBe(session.role);
    expect(saved.token).toBe(session.token);
    expect(saved.expiresAt).toBeTypeOf('number');
    
    sessionStore.logout();
    expect(localStorage.getItem('susorewards_session')).toBeNull();
  });

  it('should load session from localStorage if valid', () => {
    const validSession = {
      username: 'valid_user',
      role: 'admin',
      token: 'token-123',
      expiresAt: Date.now() + 10000
    };
    localStorage.setItem('susorewards_session', JSON.stringify(validSession));
    
    // Call private method for testing coverage
    (sessionStore as any).loadFromStorage();
    expect(sessionStore.isAuthenticated).toBe(true);
    expect(sessionStore.current?.username).toBe('valid_user');
  });

  it('should clear session from localStorage if expired', () => {
    const expiredSession = {
      username: 'expired_user',
      role: 'client',
      token: 'token-456',
      expiresAt: Date.now() - 10000
    };
    localStorage.setItem('susorewards_session', JSON.stringify(expiredSession));
    
    (sessionStore as any).loadFromStorage();
    expect(sessionStore.isAuthenticated).toBe(false);
    expect(localStorage.getItem('susorewards_session')).toBeNull();
  });

  it('should clear session from localStorage if JSON is invalid', () => {
    localStorage.setItem('susorewards_session', 'invalid-json{');
    
    (sessionStore as any).loadFromStorage();
    expect(sessionStore.isAuthenticated).toBe(false);
    expect(localStorage.getItem('susorewards_session')).toBeNull();
  });
});
