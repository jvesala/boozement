import { test, expect } from '@playwright/test';
import { registerAndLogin } from './testUtils';

test.describe('Insert test', () => {
  test.beforeEach(async ({ page, request }) => {
    await registerAndLogin(page, request);
  });

  test('Inserts serving and checks active', async ({ page }) => {
    await page.goto('http://localhost:3000/insert');
    await page.fill('input[name=type]', 'Beer');
    await page.fill('input[name=amount]', '33');
    await page.fill('input[name=units]', '1');
    await page.click('button[type=submit]');
    await expect(page.getByText('ajanhetkell')).toBeVisible();
    await page.goto('http://localhost:3000/active');
    await expect(page.getByText('Beer')).toBeVisible();
    await expect(page.getByText('0.21')).toBeVisible();
  });
});
