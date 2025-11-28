// spec: tests/plans/petstore-api-plan.md
// API Tests for Petstore - Store Operations

import { test, expect, APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://petstore.swagger.io/v2';

test.describe('Store Operations', () => {
  let request: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  test('2.1 Get Store Inventory (GET /store/inventory)', async () => {
    // 1. Send GET request to /store/inventory
    const response = await request.get(`${BASE_URL}/store/inventory`);

    // 2. Verify response status is 200
    expect(response.status()).toBe(200);

    // 3. Verify response is an object with status counts
    const inventory = await response.json();
    expect(typeof inventory).toBe('object');
    expect(inventory).not.toBeNull();
  });

  test('2.2 Place an Order (POST /store/order)', async () => {
    // 1. Send POST request to /store/order with valid order data
    const orderId = Math.floor(Math.random() * 10) + 1; // Use 1-10 range
    const orderData = {
      id: orderId,
      petId: 1,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
    };

    const response = await request.post(`${BASE_URL}/store/order`, {
      data: orderData,
    });

    // 2. Verify response status is 200
    expect(response.status()).toBe(200);

    // 3. Verify response contains order ID and pet ID
    const order = await response.json();
    expect(order).toHaveProperty('id');
    expect(order.petId).toBe(orderData.petId);
    expect(order.status).toBe('placed');
  });

  test('2.3 Get Order by ID (GET /store/order/{orderId})', async () => {
    // 1. Place a new order first
    const orderId = Math.floor(Math.random() * 10) + 1; // Use 1-10 range for valid orders
    const orderData = {
      id: orderId,
      petId: 2,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
    };
    const createResponse = await request.post(`${BASE_URL}/store/order`, { data: orderData });
    expect(createResponse.status()).toBe(200);

    // 2. Send GET request to /store/order/{orderId}
    const response = await request.get(`${BASE_URL}/store/order/${orderId}`);

    // 3. Verify response status is 200
    expect(response.status()).toBe(200);

    // 4. Verify order details match
    const order = await response.json();
    expect(order.id).toBe(orderId);
    expect(order.petId).toBe(orderData.petId);
  });

  test('2.4 Get Non-Existent Order (GET /store/order/{orderId})', async () => {
    // 1. Send GET request to /store/order/999999999 (non-existent)
    const response = await request.get(`${BASE_URL}/store/order/999999999`);

    // 2. Verify response status is 404
    expect(response.status()).toBe(404);
  });

  test('2.5 Delete Order (DELETE /store/order/{orderId})', async () => {
    // 1. Place a new order
    const orderId = Math.floor(Math.random() * 10) + 1; // Use 1-10 range
    const orderData = {
      id: orderId,
      petId: 3,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
    };
    const createResponse = await request.post(`${BASE_URL}/store/order`, { data: orderData });
    expect(createResponse.status()).toBe(200);

    // 2. Send DELETE request to /store/order/{orderId}
    const deleteResponse = await request.delete(`${BASE_URL}/store/order/${orderId}`);

    // 3. Verify response status is 200
    expect(deleteResponse.status()).toBe(200);

    // 4. GET the order and verify it returns 404
    const getResponse = await request.get(`${BASE_URL}/store/order/${orderId}`);
    expect(getResponse.status()).toBe(404);
  });
});
