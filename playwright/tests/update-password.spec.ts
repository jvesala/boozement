import { test, expect } from '@playwright/test';
import { registerAndLogin } from './testUtils';

test.describe('Update password test', () => {
  test('Updates password', async ({ page, request }) => {
    const { password } = await registerAndLogin(page, request);
    await page.goto('http://localhost:3000/userdata');
    await page.fill('input[name=current]', password);
    await page.fill('input[name=new]', 'passwordPassword');
    await page.fill('input[name=copy]', 'passwordPassword');
    await page.click('button >> nth=1');
    await expect(page.getByText('Salasana vaihdettu')).toBeVisible();
  });
});
