import { test, expect } from '@playwright/test';
import { registerAndLogin } from './testUtils';

test.describe('Main page tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Opens main page - FI', async ({ page }) => {
    await expect(page).toHaveTitle(/Boozement/);
    await expect(page.getByText('Kirjaudu sisään')).toBeVisible();
  });

  test('Opens main page - EN', async ({ page }) => {
    await expect(page).toHaveTitle(/Boozement/);
    await page.click('button.flagEN');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('Logs in to system', async ({ page, request }) => {
    const { email, password } = await registerAndLogin(request);

    await expect(page).toHaveTitle(/Boozement/);
    await page.click('button.flagEN');

    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', password);
    await expect(page.getByText(email)).not.toBeVisible();
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText(email)).toBeVisible();
  });
});
