// spec: tests/plans/saucedemo-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Inventory', () => {
  test.beforeEach(async ({ page }) => {
    // Login as standard_user before each test
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('2.1 Verify Product Display', async ({ page }) => {
    // Observe the Products page

    // Expected: 6 products are displayed
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // Expected: Each product shows name, description, price, and "Add to cart" button
    const firstProduct = page.locator('.inventory_item').first();
    await expect(firstProduct.locator('.inventory_item_name')).toBeVisible();
    await expect(firstProduct.locator('.inventory_item_desc')).toBeVisible();
    await expect(firstProduct.locator('.inventory_item_price')).toBeVisible();
    await expect(firstProduct.locator('button')).toBeVisible();

    // Expected: Products are sorted alphabetically (A to Z) by default
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
    expect(productNames).toEqual(sortedNames);
  });

  test('2.2 Sort Products by Price (Low to High)', async ({ page }) => {
    // Click the sort dropdown and select "Price (low to high)"
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    // Expected: Products reorder with lowest price first
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map((p) => parseFloat(p.replace('$', '')));

    // Verify prices are in ascending order
    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
    }

    // Expected: Lowest price first ($7.99 Onesie)
    expect(numericPrices[0]).toBe(7.99);

    // Expected: Highest price last ($49.99 Fleece Jacket)
    expect(numericPrices[numericPrices.length - 1]).toBe(49.99);
  });

  test('2.3 Sort Products by Price (High to Low)', async ({ page }) => {
    // Click the sort dropdown and select "Price (high to low)"
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');

    // Expected: Products reorder with highest price first
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map((p) => parseFloat(p.replace('$', '')));

    // Verify prices are in descending order
    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i + 1]);
    }

    // Expected: Highest price first ($49.99 Fleece Jacket)
    expect(numericPrices[0]).toBe(49.99);

    // Expected: Lowest price last ($7.99 Onesie)
    expect(numericPrices[numericPrices.length - 1]).toBe(7.99);
  });

  test('2.4 Sort Products by Name (Z to A)', async ({ page }) => {
    // Click the sort dropdown and select "Name (Z to A)"
    await page.locator('[data-test="product-sort-container"]').selectOption('za');

    // Expected: Products reorder alphabetically in reverse order
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    const sortedNames = [...productNames].sort((a, b) => b.localeCompare(a));
    expect(productNames).toEqual(sortedNames);

    // Expected: "Test.allTheThings() T-Shirt (Red)" appears first
    expect(productNames[0]).toBe('Test.allTheThings() T-Shirt (Red)');
  });
});

