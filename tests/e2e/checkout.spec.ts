// spec: tests/plans/saucedemo-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as standard_user and add item to cart before each test
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Add Sauce Labs Backpack to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('4.1 Complete Checkout - Happy Path', async ({ page }) => {
    // Click cart icon
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart\.html/);

    // Click "Checkout" button
    await page.locator('[data-test="checkout"]').click();

    // Expected: Navigate to checkout-step-one.html
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Fill in First Name
    await page.locator('[data-test="firstName"]').fill('John');

    // Fill in Last Name
    await page.locator('[data-test="lastName"]').fill('Doe');

    // Fill in Zip/Postal Code
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Click "Continue" button
    await page.locator('[data-test="continue"]').click();

    // Expected: Navigate to checkout-step-two.html
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    // Verify order summary
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.summary_subtotal_label')).toContainText('$29.99');
    await expect(page.locator('.summary_tax_label')).toContainText('$2.40');
    await expect(page.locator('.summary_total_label')).toContainText('$32.39');

    // Click "Finish" button
    await page.locator('[data-test="finish"]').click();

    // Expected: Navigate to checkout-complete.html
    await expect(page).toHaveURL(/.*checkout-complete\.html/);

    // Expected: "Thank you for your order!" message displayed
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

    // Expected: "Back Home" button visible
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('4.2 Checkout with Empty First Name', async ({ page }) => {
    // Go to checkout
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Leave First Name empty, fill Last Name and Zip Code
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Click "Continue"
    await page.locator('[data-test="continue"]').click();

    // Expected: Error message
    await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');

    // Expected: User stays on checkout-step-one.html
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('4.3 Checkout with Empty Last Name', async ({ page }) => {
    // Go to checkout
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    // Fill First Name, leave Last Name empty, fill Zip Code
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Click "Continue"
    await page.locator('[data-test="continue"]').click();

    // Expected: Error message
    await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');
  });

  test('4.4 Checkout with Empty Postal Code', async ({ page }) => {
    // Go to checkout
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    // Fill First Name and Last Name, leave Zip Code empty
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');

    // Click "Continue"
    await page.locator('[data-test="continue"]').click();

    // Expected: Error message
    await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');
  });

  test('4.5 Cancel Checkout', async ({ page }) => {
    // Go to checkout
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Click "Cancel" button
    await page.locator('[data-test="cancel"]').click();

    // Expected: Navigate back to cart page
    await expect(page).toHaveURL(/.*cart\.html/);

    // Expected: Items still in cart
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });
});

