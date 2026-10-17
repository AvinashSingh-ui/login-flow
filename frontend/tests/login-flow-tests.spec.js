
import { test, expect } from '@playwright/test';

const loginUrl = 'https://login-flow-black.vercel.app/login';

test('login page displays all required elements', async ({ page }) => {
  await page.goto(loginUrl);

  await expect(
    page.getByRole('textbox', { name: 'Email address' })
  ).toBeVisible();

  await expect(
    page.getByRole('textbox', { name: 'Password' })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Sign in' })
  ).toBeVisible();
});

test('invalid credentials display an error', async ({ page }) => {
  await page.goto(loginUrl);

  await page.getByRole('textbox', { name: 'Email address' })
    .fill('wrong@example.com');

  await page.getByRole('textbox', { name: 'Password' })
    .fill('WrongPassword123!');

  await page.getByRole('button', { name: 'Sign in' }).click();


  await expect(
    page.getByText(/invalid credentials|incorrect password|login failed/i)
  ).toBeVisible();
});

test('user can log in and log out', async ({ page }) => {
  await page.goto(loginUrl);

  await page.getByRole('textbox', { name: 'Email address' })
    .fill('student@gmail.com');

  await page.getByRole('textbox', { name: 'Password' })
    .fill('123456');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(
    page.getByRole('button', { name: 'Logout' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(
    page.getByRole('textbox', { name: 'Email address' })
  ).toBeVisible();
});
