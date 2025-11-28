// spec: tests/plans/saucedemo-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('https://www.saucedemo.com/');
  });

  test('1.1 Successful Login with Standard User', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/ (done in beforeEach)

    // 2. Enter username "standard_user" in the Username field
    await page.locator('[data-test="username"]').fill('standard_user');

    // 3. Enter password "secret_sauce" in the Password field
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 4. Click the "Login" button
    await page.locator('[data-test="login-button"]').click();

    // Expected: User is redirected to /inventory.html
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Expected: Products page displays with 6 items
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // Expected: "Products" header is visible
    await expect(page.locator('.title')).toHaveText('Products');

    // Expected: Shopping cart icon is visible in header
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('1.2 Login with Locked Out User', async ({ page }) => {
    // 2. Enter username "locked_out_user" in the Username field
    await page.locator('[data-test="username"]').fill('locked_out_user');

    // 3. Enter password "secret_sauce" in the Password field
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 4. Click the "Login" button
    await page.locator('[data-test="login-button"]').click();

    // Expected: Error message appears
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );

    // Expected: User remains on login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('1.3 Login with Invalid Credentials', async ({ page }) => {
    // 2. Enter username "invalid_user" in the Username field
    await page.locator('[data-test="username"]').fill('invalid_user');

    // 3. Enter password "wrong_password" in the Password field
    await page.locator('[data-test="password"]').fill('wrong_password');

    // 4. Click the "Login" button
    await page.locator('[data-test="login-button"]').click();

    // Expected: Error message appears indicating invalid credentials
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );

    // Expected: User remains on login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('1.4 Login with Empty Fields', async ({ page }) => {
    // 2. Leave username field empty
    // 3. Leave password field empty

    // 4. Click the "Login" button
    await page.locator('[data-test="login-button"]').click();

    // Expected: Error message appears: "Username is required"
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Username is required'
    );
  });
});

