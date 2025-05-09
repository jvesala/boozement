import { RegisterUser } from '../../src/server/domain';
import { APIRequestContext, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export type LoggedInUser = {
  email: string;
  password: string;
};

export const registerAndLogin = async (
  page: Page,
  request: APIRequestContext,
): Promise<LoggedInUser> => {
  const now = Date.now();
  const random = Math.round(Math.random() * 1000000);
  const email = `test.email.login+${now}-${random}@example.com`;
  const password = 'passwordPassword';
  const user: RegisterUser = {
    email,
    gender: 'M',
    password,
    weight: 75000,
  };
  await request.post('http://localhost:3000/api/register', {
    data: user,
  });

  await page.goto('http://localhost:3000');
  await page.click('button.flagFI');
  await page.fill('input[name=email]', email);
  await page.fill('input[name=password]', password);
  await expect(page.getByText(email)).not.toBeVisible();
  await page.getByRole('button', { name: 'Kirjaudu' }).click();
  await expect(page.getByText(email)).toBeVisible();

  return {
    email,
    password,
  };
};
