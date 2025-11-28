// spec: tests/plans/saucedemo-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Details', () => {
  test.beforeEach(async ({ page }) => {
    // Login as standard_user before each test
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('5.1 View Product Details', async ({ page }) => {
    // Click on product name "Sauce Labs Backpack"
    await page.locator('[data-test="item-4-title-link"]').click();

    // Expected: Navigate to inventory-item.html
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Expected: Product image displayed
    await expect(page.locator('.inventory_details_img')).toBeVisible();

    // Expected: Product name, description, and price shown
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
    await expect(page.locator('.inventory_details_price')).toHaveText('$29.99');

    // Expected: "Add to cart" button visible
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();

    // Expected: "Back to products" button visible
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('5.2 Add to Cart from Product Detail Page', async ({ page }) => {
    // Click on product name
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Click "Add to cart" button
    await page.locator('[data-test="add-to-cart"]').click();

    // Expected: Button changes to "Remove"
    await expect(page.locator('[data-test="remove"]')).toBeVisible();

    // Expected: Cart badge shows "1"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('5.3 Navigate Back to Products', async ({ page }) => {
    // Click on any product name
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Click "Back to products" button
    await page.locator('[data-test="back-to-products"]').click();

    // Expected: Navigate back to /inventory.html
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Expected: All products displayed
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });
});

