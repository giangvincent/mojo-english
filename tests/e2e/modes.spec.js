import { test, expect } from '@playwright/test';

// T25: mode selection flow on the Quick Match setup page.
// Verifies mode selection, the disabled FIND MATCH guard, and Back navigation.
// We avoid asserting on the waiting-room render path, which hits live
// matchmaking and is out of scope for local-first E2E.

test.describe('Mode selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('auth_token', 'e2e-token'));
  });
  test('selecting a mode enables FIND MATCH', async ({ page }) => {
    await page.goto('/#/quick-match');
    await expect(page.getByText('Choose Mode')).toBeVisible();

    await expect(page.getByRole('button', { name: 'FIND MATCH' })).toBeDisabled();
    await page.getByRole('button', { name: /Standard/ }).click();
    await expect(page.getByRole('button', { name: 'FIND MATCH' })).toBeEnabled();
  });

  test('each mode button is selectable', async ({ page }) => {
    await page.goto('/#/quick-match');
    await page.getByRole('button', { name: /Co-op/ }).click();
    await expect(page.getByRole('button', { name: /Co-op/ })).toHaveClass(/primary/);
    await page.getByRole('button', { name: /5\/4 Split/ }).click();
    await expect(page.getByRole('button', { name: /5\/4 Split/ })).toHaveClass(/primary/);
  });

  test('FIND MATCH is disabled before selecting a mode', async ({ page }) => {
    await page.goto('/#/quick-match');
    await expect(page.getByRole('button', { name: 'FIND MATCH' })).toBeDisabled();
  });

  test('Back returns from quick match to home', async ({ page }) => {
    await page.goto('/#/quick-match');
    await page.getByRole('button', { name: 'BACK' }).click();
    await expect(page).toHaveURL(/\/#$|\/$/);
    await expect(page.getByText('Standard Match')).toBeVisible();
  });

  test('standard completes three exchange rounds before sentence building', async ({ page }) => {
    await page.goto('/#/play?mode=standard');
    await expect(page.getByText('Exchange Round 1 of 3')).toBeVisible();
    await page.getByRole('button', { name: 'FINISH EXCHANGE ROUND' }).click();
    await expect(page.getByText('Exchange Round 2 of 3')).toBeVisible();
    await page.getByRole('button', { name: 'FINISH EXCHANGE ROUND' }).click();
    await expect(page.getByText('Exchange Round 3 of 3')).toBeVisible();
    await page.getByRole('button', { name: 'FINISH EXCHANGE ROUND' }).click();
    await expect(page.getByText('Sentence Builder', { exact: false })).toBeVisible();
  });

  test('5/4 split grows through four exchange rounds', async ({ page }) => {
    await page.goto('/#/play?mode=5-4-split');
    for (const round of [1, 2, 3, 4]) {
      await expect(page.getByText(`Exchange Round ${round} of 4`)).toBeVisible();
      await page.getByRole('button', { name: 'FINISH EXCHANGE ROUND' }).click();
    }
    await expect(page.getByText('Sentence Builder', { exact: false })).toBeVisible();
  });

  test('co-op starts directly in sentence building', async ({ page }) => {
    await page.goto('/#/play?mode=coop');
    await expect(page.getByText('Sentence Builder', { exact: false })).toBeVisible();
  });
});
