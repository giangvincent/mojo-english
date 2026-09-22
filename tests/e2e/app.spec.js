import { test, expect } from '@playwright/test';

// T25: end-to-end app spec covering navigation, home entry points, the Vault
// and Shopping views, and the catch-all redirect. Exercises the real Vite
// bundle (hash history, so paths look like `/#/…`).

test.describe('VerbaPix app', () => {
  test('home page loads with gameplay entry points', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Standard Match', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: 'QUICK MATCH' })).toBeVisible();
    await expect(page.getByText('Sign in', { exact: false })).toBeVisible();
  });

  test('vault route is navigable and renders header', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('auth_token', 'e2e-token'));
    await page.goto('/#/vault');
    await expect(page.locator('text=My Vault')).toBeVisible();
  });

  test('protected vault redirects a guest to sign in', async ({ page }) => {
    await page.goto('/#/vault');
    await expect(page).toHaveURL(/signIn=required/);
    await expect(page.getByText('Sign in', { exact: false })).toBeVisible();
  });

  test('shopping route is navigable', async ({ page }) => {
    await page.goto('/#/shopping');
    await expect(page.locator('text=Shopping', { exact: true })).toBeVisible();
  });

  test('dashboard route renders progression sections', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('auth_token', 'e2e-token'));
    await page.goto('/#/dashboard');
    await expect(page.getByText('THEMES')).toBeVisible();
    await expect(page.getByText('CARD SETS')).toBeVisible();
    await expect(page.getByText('TENSES')).toBeVisible();
  });

  test('unknown route redirects to home (catch-all)', async ({ page }) => {
    await page.goto('/#/this-route-does-not-exist');
    await expect(page.getByText('Standard Match', { exact: false })).toBeVisible();
  });
});
