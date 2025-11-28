// spec: tests/plans/saucedemo-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Login as standard_user before each test
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('3.1 Add Single Item to Cart', async ({ page }) => {
    // Click "Add to cart" on "Sauce Labs Backpack"
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Expected: Button changes to "Remove"
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();

    // Expected: Cart badge shows "1"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('3.2 Add Multiple Items to Cart', async ({ page }) => {
    // Click "Add to cart" on "Sauce Labs Backpack"
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Click "Add to cart" on "Sauce Labs Bike Light"
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Expected: Both buttons change to "Remove"
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

    // Expected: Cart badge shows "2"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('3.3 Remove Item from Cart (Inventory Page)', async ({ page }) => {
    // Add "Sauce Labs Backpack" to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Click "Remove" button on the same product
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // Expected: Button changes back to "Add to cart"
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();

    // Expected: Cart badge disappears
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('3.4 View Cart Contents', async ({ page }) => {
    // Add "Sauce Labs Backpack" to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Click the shopping cart icon
    await page.locator('.shopping_cart_link').click();

    // Expected: Navigate to /cart.html
    await expect(page).toHaveURL(/.*cart\.html/);

    // Expected: Cart displays the added item
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // Expected: Item shows quantity, name, description, and price
    const cartItem = page.locator('.cart_item').first();
    await expect(cartItem.locator('.cart_quantity')).toHaveText('1');
    await expect(cartItem.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(cartItem.locator('.inventory_item_desc')).toBeVisible();
    await expect(cartItem.locator('.inventory_item_price')).toHaveText('$29.99');

    // Expected: "Continue Shopping" and "Checkout" buttons are visible
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('3.5 Remove Item from Cart Page', async ({ page }) => {
    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Go to cart page
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart\.html/);

    // Click "Remove" button
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // Expected: Item is removed from cart
    await expect(page.locator('.cart_item')).toHaveCount(0);

    // Expected: Cart badge disappears
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});

