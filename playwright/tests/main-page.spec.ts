import { test, expect } from '@playwright/test';
import { RegisterUser } from '../../src/server/domain';

test.describe('Main page tests', () => {
  test('Opens main page - FI', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Boozement/);
    await expect(page.getByText('Kirjaudu sisään')).toBeVisible();
  });

  test('Opens main page - EN', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Boozement/);
    await page.click('button.flagEN');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('Logs in to system', async ({ page, request }) => {
    const now = Date.now();
    const email = `test.email.login+${now}@example.com`;
    const password = 'passwordPassword';
    const user: RegisterUser = {
      email,
      gender: 'M',
      password,
      weight: 75000,
    };
    await request.post("http://localhost:3000/api/register", {
      data: user
    })

    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Boozement/);
    await page.click('button.flagEN');

    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', password);
    await expect(page.getByText(email)).not.toBeVisible();
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText(email)).toBeVisible();
  });
});
