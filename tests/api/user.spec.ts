// spec: tests/plans/petstore-api-plan.md
// API Tests for Petstore - User Operations

import { test, expect, APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://petstore.swagger.io/v2';

test.describe('User Operations', () => {
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

  test('3.1 Create User (POST /user)', async () => {
    // 1. Send POST request to /user with valid user data
    const userData = {
      id: Math.floor(Math.random() * 1000000) + 1000,
      username: 'testuser_' + Date.now(),
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      userStatus: 1,
    };

    const response = await request.post(`${BASE_URL}/user`, {
      data: userData,
    });

    // 2. Verify response status is 200
    expect(response.status()).toBe(200);

    // 3. Verify response indicates success
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
  });

  test('3.2 Get User by Username (GET /user/{username})', async () => {
    // 1. Create a user first
    const username = 'getuser_' + Date.now();
    const userData = {
      id: Math.floor(Math.random() * 1000000) + 2000,
      username: username,
      firstName: 'Get',
      lastName: 'User',
      email: 'getuser@example.com',
      password: 'password123',
      phone: '1234567890',
      userStatus: 1,
    };
    const createResponse = await request.post(`${BASE_URL}/user`, { data: userData });
    expect(createResponse.status()).toBe(200);

    // 2. Send GET request to /user/{username}
    const response = await request.get(`${BASE_URL}/user/${username}`);

    // 3. Verify response status is 200
    expect(response.status()).toBe(200);

    // 4. Verify user data matches
    const user = await response.json();
    expect(user.username).toBe(username);
    expect(user.firstName).toBe(userData.firstName);
  });

  test('3.3 Get Non-Existent User (GET /user/{username})', async () => {
    // 1. Send GET request to /user/nonexistent_user_xyz123
    const response = await request.get(`${BASE_URL}/user/nonexistent_user_xyz123_${Date.now()}`);

    // 2. Verify response status is 404
    expect(response.status()).toBe(404);
  });

  test('3.4 User Login (GET /user/login)', async () => {
    // 1. Send GET request to /user/login?username=test&password=test
    const response = await request.get(`${BASE_URL}/user/login?username=test&password=test`);

    // 2. Verify response status is 200
    expect(response.status()).toBe(200);

    // 3. Verify response contains session info
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
  });

  test('3.5 User Logout (GET /user/logout)', async () => {
    // 1. Send GET request to /user/logout
    const response = await request.get(`${BASE_URL}/user/logout`);

    // 2. Verify response status is 200
    expect(response.status()).toBe(200);
  });

  test('3.6 Update User (PUT /user/{username})', async () => {
    // 1. Create a user
    const username = 'updateuser_' + Date.now();
    const userData = {
      id: Math.floor(Math.random() * 1000000) + 3000,
      username: username,
      firstName: 'Original',
      lastName: 'User',
      email: 'original@example.com',
      password: 'password123',
      phone: '1234567890',
      userStatus: 1,
    };
    const createResponse = await request.post(`${BASE_URL}/user`, { data: userData });
    expect(createResponse.status()).toBe(200);

    // 2. Send PUT request with updated data
    const updatedUserData = {
      ...userData,
      firstName: 'Updated',
      email: 'updated@example.com',
    };
    const updateResponse = await request.put(`${BASE_URL}/user/${username}`, {
      data: updatedUserData,
    });

    // 3. Verify response status is 200
    expect(updateResponse.status()).toBe(200);

    // 4. GET the user and verify update
    const getResponse = await request.get(`${BASE_URL}/user/${username}`);
    const user = await getResponse.json();
    expect(user.firstName).toBe('Updated');
  });

  test('3.7 Delete User (DELETE /user/{username})', async () => {
    // 1. Create a user
    const username = 'deleteuser_' + Date.now();
    const userData = {
      id: Math.floor(Math.random() * 1000000) + 4000,
      username: username,
      firstName: 'Delete',
      lastName: 'User',
      email: 'delete@example.com',
      password: 'password123',
      phone: '1234567890',
      userStatus: 1,
    };
    const createResponse = await request.post(`${BASE_URL}/user`, { data: userData });
    expect(createResponse.status()).toBe(200);

    // 2. Send DELETE request to /user/{username}
    const deleteResponse = await request.delete(`${BASE_URL}/user/${username}`);

    // 3. Verify response status is 200
    expect(deleteResponse.status()).toBe(200);

    // 4. GET the user and verify 404
    const getResponse = await request.get(`${BASE_URL}/user/${username}`);
    expect(getResponse.status()).toBe(404);
  });
});
