export interface UserSession {
  username: string;
  role: 'admin' | 'restaurant' | 'client';
  restaurantCode?: string;
  token: string;
  expiresAt?: number;
}

class SessionStore {
  #current = $state<UserSession | null>(null);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof globalThis.window !== 'undefined' && globalThis.window.localStorage) {
      const saved = globalThis.window.localStorage.getItem('susorewards_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as UserSession;
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            globalThis.window.localStorage.removeItem('susorewards_session');
            this.#current = null;
          } else {
            this.#current = parsed;
          }
        } catch {
          globalThis.window.localStorage.removeItem('susorewards_session');
        }
      }
    }
  }

  get current() {
    return this.#current;
  }

  get isAuthenticated() {
    return this.#current !== null;
  }

  get restaurantCode() {
    return this.#current?.restaurantCode || null;
  }

  login(session: Omit<UserSession, 'expiresAt'>) {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const sessionWithExp: UserSession = { ...session, expiresAt };
    this.#current = sessionWithExp;
    if (typeof globalThis.window !== 'undefined' && globalThis.window.localStorage) {
      globalThis.window.localStorage.setItem('susorewards_session', JSON.stringify(sessionWithExp));
    }
  }

  logout() {
    this.#current = null;
    if (typeof globalThis.window !== 'undefined' && globalThis.window.localStorage) {
      globalThis.window.localStorage.removeItem('susorewards_session');
    }
  }
}

export const sessionStore = new SessionStore();
