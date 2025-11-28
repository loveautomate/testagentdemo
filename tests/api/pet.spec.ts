// spec: tests/plans/petstore-api-plan.md
// API Tests for Petstore - Pet Management

import { test, expect, APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://petstore.swagger.io/v2';

test.describe('Pet Management', () => {
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

  test('1.1 Create a New Pet (POST /pet)', async () => {
    // 1. Send POST request to /pet with valid pet data
    const petData = {
      id: Math.floor(Math.random() * 1000000) + 1000,
      name: 'TestDog_' + Date.now(),
      photoUrls: ['https://example.com/photo.jpg'],
      status: 'available',
      category: { id: 1, name: 'Dogs' },
      tags: [{ id: 1, name: 'friendly' }],
    };

    const response = await request.post(`${BASE_URL}/pet`, {
      data: petData,
    });

    // 2. Verify response status is 200
    expect(response.status()).toBe(200);

    // 3. Verify response body contains the created pet with an ID
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('name');
    expect(responseBody).toHaveProperty('status');

    // 4. Verify the pet name matches the request
    expect(responseBody.name).toBe(petData.name);
    expect(responseBody.status).toBe('available');
  });

  test('1.2 Get Pet by ID (GET /pet/{petId})', async () => {
    // 1. Create a new pet first
    const petId = Math.floor(Math.random() * 1000000) + 2000;
    const petData = {
      id: petId,
      name: 'GetTestPet_' + Date.now(),
      photoUrls: ['https://example.com/photo.jpg'],
      status: 'available',
    };
    const createResponse = await request.post(`${BASE_URL}/pet`, { data: petData });
    expect(createResponse.status()).toBe(200);

    // 2. Send GET request to /pet/{petId}
    const response = await request.get(`${BASE_URL}/pet/${petId}`);

    // 3. Verify response status is 200
    expect(response.status()).toBe(200);

    // 4. Verify response body contains correct pet data
    const pet = await response.json();
    expect(pet.id).toBe(petId);
    expect(pet.name).toBe(petData.name);
  });

  test('1.3 Get Non-Existent Pet (GET /pet/{petId})', async () => {
    // 1. Send GET request to /pet/999999999999 (non-existent ID)
    const response = await request.get(`${BASE_URL}/pet/999999999999`);

    // 2. Verify response status is 404
    expect(response.status()).toBe(404);
  });

  test('1.4 Find Pets by Status (GET /pet/findByStatus)', async () => {
    // 1. Send GET request to /pet/findByStatus?status=available
    const response = await request.get(`${BASE_URL}/pet/findByStatus?status=available`);

    // 2. Verify response status is 200
    expect(response.status()).toBe(200);

    // 3. Verify response is an array
    const pets = await response.json();
    expect(Array.isArray(pets)).toBe(true);

    // 4. Verify all returned pets have status "available"
    if (pets.length > 0) {
      pets.slice(0, 5).forEach((pet: { status: string }) => {
        expect(pet.status).toBe('available');
      });
    }
  });

  test('1.5 Update Pet (PUT /pet)', async () => {
    // 1. Create a new pet
    const petId = Math.floor(Math.random() * 1000000) + 3000;
    const originalPet = {
      id: petId,
      name: 'OriginalPet_' + Date.now(),
      photoUrls: ['https://example.com/photo.jpg'],
      status: 'available',
    };
    const createResponse = await request.post(`${BASE_URL}/pet`, { data: originalPet });
    expect(createResponse.status()).toBe(200);

    // 2. Send PUT request with updated name
    const updatedName = 'UpdatedPet_' + Date.now();
    const updatedPetData = {
      id: petId,
      name: updatedName,
      photoUrls: ['https://example.com/photo.jpg'],
      status: 'available',
    };
    const updateResponse = await request.put(`${BASE_URL}/pet`, { data: updatedPetData });

    // 3. Verify response status is 200
    expect(updateResponse.status()).toBe(200);

    // 4. GET the pet and verify name was updated
    const getResponse = await request.get(`${BASE_URL}/pet/${petId}`);
    const fetchedPet = await getResponse.json();
    expect(fetchedPet.name).toBe(updatedName);
  });

  test('1.6 Delete Pet (DELETE /pet/{petId})', async () => {
    // 1. Create a new pet
    const petId = Math.floor(Math.random() * 1000000) + 4000;
    const petData = {
      id: petId,
      name: 'DeleteTestPet_' + Date.now(),
      photoUrls: ['https://example.com/photo.jpg'],
      status: 'available',
    };
    const createResponse = await request.post(`${BASE_URL}/pet`, { data: petData });
    expect(createResponse.status()).toBe(200);

    // 2. Send DELETE request to /pet/{petId}
    const deleteResponse = await request.delete(`${BASE_URL}/pet/${petId}`);

    // 3. Verify response status is 200
    expect(deleteResponse.status()).toBe(200);

    // 4. GET the pet and verify it returns 404
    const getResponse = await request.get(`${BASE_URL}/pet/${petId}`);
    expect(getResponse.status()).toBe(404);
  });
});
