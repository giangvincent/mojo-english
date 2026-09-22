import { describe, it, expect, beforeEach } from 'vitest';
import router from '@/router';

describe('protected routes', () => {
  beforeEach(async () => {
    localStorage.clear();
    await router.push('/');
  });

  it('redirects guests away from the vault', async () => {
    await router.push('/vault');
    expect(router.currentRoute.value.path).toBe('/');
    expect(router.currentRoute.value.query.signIn).toBe('required');
  });

  it('allows authenticated users into the vault', async () => {
    localStorage.setItem('auth_token', 'test-token');
    await router.push('/vault');
    expect(router.currentRoute.value.path).toBe('/vault');
  });
});
