import { RegisterUser } from '../../src/server/domain';
import { APIRequestContext } from '@playwright/test';

export type LoggedInUser = {
  email: string;
  password: string;
};

export const registerAndLogin = async (
  request: APIRequestContext
): Promise<LoggedInUser> => {
  const now = Date.now();
  const email = `test.email.login+${now}@example.com`;
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
  return {
    email,
    password,
  };
};
