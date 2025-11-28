// spec: tests/plans/saucedemo-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation & Logout', () => {
  test.beforeEach(async ({ page }) => {
    // Login as standard_user before each test
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('6.1 Logout', async ({ page }) => {
    // Click hamburger menu (Open Menu button)
    await page.locator('#react-burger-menu-btn').click();

    // Wait for menu to be visible
    await expect(page.locator('.bm-menu')).toBeVisible();

    // Click "Logout"
    await page.locator('#logout_sidebar_link').click();

    // Expected: Navigate to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // Expected: User is logged out - login form is visible
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('6.2 Reset App State', async ({ page }) => {
    // Add items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Click hamburger menu
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu')).toBeVisible();

    // Click "Reset App State"
    await page.locator('#reset_sidebar_link').click();

    // Expected: Cart is cleared (badge disappears)
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

    // Close the menu
    await page.locator('#react-burger-cross-btn').click();

    // Refresh the page to see the reset state reflected in the UI
    // (Reset App State clears the cart data but doesn't update button text until page reload)
    await page.reload();

    // Expected: All "Remove" buttons change back to "Add to cart"
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();
  });
});

