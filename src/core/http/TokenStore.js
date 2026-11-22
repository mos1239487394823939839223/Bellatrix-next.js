/**
 * Single owner of the admin session token.
 *
 * The app historically wrote the token under two keys ("authToken",
 * "adminToken") in local or session storage; reads check all four so older
 * sessions keep working, writes keep both keys in sync, and clear() removes
 * every copy. Safe to call on the server (returns null / no-ops).
 */
const KEYS = { token: "authToken", legacyToken: "adminToken", user: "adminUser" };

const hasWindow = () => typeof window !== "undefined";

const storages = () => (hasWindow() ? [window.localStorage, window.sessionStorage] : []);

export class TokenStore {
  getToken() {
    for (const store of storages()) {
      try {
        const value = store.getItem(KEYS.token) || store.getItem(KEYS.legacyToken);
        if (value) return value;
      } catch {
        /* storage blocked (private mode) */
      }
    }
    return null;
  }

  /** @param {string} token @param {{ remember?: boolean }} [opts] */
  setToken(token, { remember = true } = {}) {
    if (!hasWindow() || !token) return;
    const store = remember ? window.localStorage : window.sessionStorage;
    try {
      store.setItem(KEYS.token, token);
      store.setItem(KEYS.legacyToken, token);
    } catch {
      /* ignore */
    }
  }

  getUser() {
    if (!hasWindow()) return null;
    try {
      const raw = window.localStorage.getItem(KEYS.user);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  setUser(user) {
    if (!hasWindow()) return;
    try {
      window.localStorage.setItem(KEYS.user, JSON.stringify(user));
    } catch {
      /* ignore */
    }
  }

  clear() {
    for (const store of storages()) {
      try {
        Object.values(KEYS).forEach((k) => store.removeItem(k));
      } catch {
        /* ignore */
      }
    }
  }

  /** A well-formed JWT that has not expired (no network call). */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const exp = TokenStore.expiresAt(token);
    return exp === null || exp > Date.now();
  }

  /** Expiry time in ms from the JWT "exp" claim, or null if absent/unreadable. */
  static expiresAt(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return typeof payload.exp === "number" ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}

export const tokenStore = new TokenStore();
export default tokenStore;
