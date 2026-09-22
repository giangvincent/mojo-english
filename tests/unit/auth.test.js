import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateState, generateCodeVerifier, generateCodeChallenge, validateAuthState, handleAuthCallback, authedFetch
} from '@/services/auth';

const LOCAL = typeof localStorage !== 'undefined' ? localStorage : {};

describe('auth — PKCE helpers (T14)', () => {
  it('generates a non-empty verifier', () => {
    expect(generateCodeVerifier()).toBeTruthy();
  });
  it('S256 challenge is base64url, no padding', async () => {
    const c = await generateCodeChallenge('a-verifier-value');
    expect(c).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(c).not.toContain('=');
  });
});

describe('auth — state protection (T14)', () => {
  const set = (k, v) => LOCAL.setItem(k, v);
  beforeEach(() => LOCAL.clear());

  it('generates at least 128 bits of opaque state', () => {
    expect(generateState()).toMatch(/^[a-f0-9]{32}$/);
  });

  it('accepts matching state', () => {
    set('oauth_state', 'abc123');
    expect(validateAuthState('abc123')).toBe(true);
  });
  it('rejects mismatched state (CSRF)', () => {
    set('oauth_state', 'abc123');
    expect(validateAuthState('evil')).toBe(false);
  });
  it('rejects missing state when one was issued', () => {
    set('oauth_state', 'abc123');
    expect(validateAuthState(null)).toBe(false);
  });
  it('accepts no state when no flow was in progress', () => {
    expect(validateAuthState(null)).toBe(true);
  });
});

describe('auth — handleAuthCallback (T14)', () => {
  beforeEach(() => LOCAL.clear());

  it('throws when code is missing', async () => {
    await expect(handleAuthCallback(null, null)).rejects.toThrow(/code/);
  });
  it('throws on state mismatch before any network call', async () => {
    LOCAL.setItem('oauth_state', 'expected');
    const fetchSpy = vi.fn();
    global.fetch = fetchSpy;
    await expect(handleAuthCallback('the-code', 'wrong')).rejects.toThrow(/state/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('exchanges and normalizes the user', async () => {
    LOCAL.setItem('oauth_state', 'expected');
    LOCAL.setItem('pkce_verifier', 'verifier');
    global.fetch = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      text: () => Promise.resolve(JSON.stringify({
        access_token: 'at', refresh_token: 'rt', user: { id: 'u1', name: 'Ada', level: 3 }
      }))
    });
    const user = await handleAuthCallback('the-code', 'expected');
    expect(user).toEqual({ id: 'u1', name: 'Ada', photo: { src: '' }, level: 3 });
    expect(LOCAL.getItem('auth_token')).toBe('at');
    expect(LOCAL.getItem('oauth_state')).toBeNull(); // cleared after success
  });
});

describe('auth — refresh + retry (T14)', () => {
  beforeEach(() => LOCAL.clear());

  it('retries once after a 401 and refreshes the token', async () => {
    LOCAL.setItem('auth_token', 'stale');
    LOCAL.setItem('refresh_token', 'rt');

    let calls = 0;
    global.fetch = vi.fn().mockImplementation(async (url, opts) => {
      calls++;
      if (url.includes('/refresh')) {
        return { ok: true, status: 200, url, text: () => Promise.resolve('{"access_token":"fresh"}') };
      }
      // first API call 401, retry succeeds
      const authorized = (opts?.headers || {}).Authorization === 'Bearer fresh';
      return { ok: authorized, status: authorized ? 200 : 401, url, text: () => Promise.resolve('{"ok":true}') };
    });

    const res = await authedFetch('https://api/me');
    expect(res.status).toBe(200);
    expect(LOCAL.getItem('auth_token')).toBe('fresh');
    expect(calls).toBe(3); // me(401) → refresh → me(200)
  });

  it('does not loop on refresh endpoints', async () => {
    LOCAL.setItem('auth_token', 'stale');
    LOCAL.setItem('refresh_token', 'rt');
    global.fetch = vi.fn().mockImplementation(async (url) => {
      if (url.includes('/refresh')) return { ok: false, status: 500, url, text: () => Promise.resolve('{"message":"bad"}') };
      return { ok: false, status: 401, url, text: () => Promise.resolve('{"message":"unauth"}') };
    });
    const res = await authedFetch('https://api/me');
    expect(res.status).toBe(401);
  });
});
