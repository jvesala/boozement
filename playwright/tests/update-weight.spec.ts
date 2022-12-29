import { test, expect } from '@playwright/test';
import { registerAndLogin } from './testUtils';

test.describe('Update weight test', () => {
  test('Updates weight', async ({ page, request }) => {
    await registerAndLogin(page, request);
    await page.goto('http://localhost:3000/userdata');
    await page.fill('input[name=weight]', '');
    await page.fill('input[name=weight]', '100');
    await page.click('button >> nth=0');
    await expect(page.getByText('Päivitetty')).toBeVisible();
  });
});
