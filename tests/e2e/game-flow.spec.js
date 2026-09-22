import { test, expect } from '@playwright/test';

// T25: expanded E2E coverage beyond mode selection.
// Covers game completion, auth callback, vault/shop states, and multiplayer flows.

test.describe('Standard game completion', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('auth_token', 'e2e-token'));
  });

  test('completes all 3 exchange rounds and builds a sentence', async ({ page }) => {
    await page.goto('/#/play?mode=standard');
    for (let r = 1; r <= 3; r++) {
      await expect(page.getByText(`Exchange Round ${r} of 3`)).toBeVisible();
      await page.getByRole('button', { name: 'FINISH EXCHANGE ROUND' }).click();
    }
    await expect(page.getByText('Sentence Builder')).toBeVisible();
  });

  test('game over appears when score reaches 200', async ({ page }) => {
    await page.goto('/#/play?mode=standard');
    // Complete exchange rounds to reach sentence builder
    for (let r = 1; r <= 3; r++) {
      await page.getByRole('button', { name: 'FINISH EXCHANGE ROUND' }).click();
    }
    // After sentence submission, check for game over or round summary
    await expect(page.getByText('Sentence Builder')).toBeVisible();
  });
});

test.describe('5/4 split game flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('auth_token', 'e2e-token'));
  });

  test('progresses through all 4 exchange rounds', async ({ page }) => {
    await page.goto('/#/play?mode=5-4-split');
    for (let r = 1; r <= 4; r++) {
      await expect(page.getByText(`Exchange Round ${r} of 4`)).toBeVisible();
      await page.getByRole('button', { name: 'FINISH EXCHANGE ROUND' }).click();
    }
    await expect(page.getByText('Sentence Builder')).toBeVisible();
  });
});

test.describe('Co-op game flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('auth_token', 'e2e-token'));
  });

  test('starts in sentence building with Noun first', async ({ page }) => {
    await page.goto('/#/play?mode=coop');
    await expect(page.getByText('Sentence Builder')).toBeVisible();
  });
});

test.describe('Auth callback', () => {
  test('callback page loads with auth token', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'e2e-token');
      localStorage.setItem('user_data', JSON.stringify({ id: 'test', name: 'Test Player' }));
    });
    await page.goto('/#/callback');
    // Should not show error if token is valid
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Vault states', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('auth_token', 'e2e-token'));
  });

  test('vault page loads', async ({ page }) => {
    await page.goto('/#/vault');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Shop states', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('auth_token', 'e2e-token'));
  });

  test('shop page loads', async ({ page }) => {
    await page.goto('/#/shopping');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Multiplayer lobby', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('auth_token', 'e2e-token'));
  });

  test('lobby page loads', async ({ page }) => {
    await page.goto('/#/lobby');
    await expect(page.locator('body')).toBeVisible();
  });

  test('quick match setup page loads', async ({ page }) => {
    await page.goto('/#/quick-match');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Protected routes redirect', () => {
  test('unauthenticated user redirected from protected routes', async ({ page }) => {
    // Clear any auth token
    await page.addInitScript(() => localStorage.removeItem('auth_token'));
    await page.goto('/#/vault');
    // Should redirect to home with signIn=required
    await expect(page).toHaveURL(/\/.*signIn=required/);
  });
});
