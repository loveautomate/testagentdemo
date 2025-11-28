# Petstore API - Comprehensive Test Plan

## API Overview

The **Swagger Petstore API** (`https://petstore.swagger.io/v2`) is a RESTful API that provides endpoints for managing:
- **Pets**: CRUD operations for pet records
- **Store**: Inventory and order management
- **Users**: User account operations

**Base URL**: `https://petstore.swagger.io/v2`

---

## Test Scenarios

### 1. Pet Management

#### 1.1 Create a New Pet (POST /pet)
**Steps:**
1. Send POST request to `/pet` with valid pet data (name, photoUrls, status)
2. Verify response status is 200
3. Verify response body contains the created pet with an ID
4. Verify the pet name matches the request

**Expected Results:**
- Response status: 200 OK
- Response contains `id`, `name`, `status` fields
- Pet data matches submitted payload

#### 1.2 Get Pet by ID (GET /pet/{petId})
**Steps:**
1. Create a new pet first (or use known ID)
2. Send GET request to `/pet/{petId}`
3. Verify response status is 200
4. Verify response body contains correct pet data

**Expected Results:**
- Response status: 200 OK
- Pet data matches expected values

#### 1.3 Get Non-Existent Pet (GET /pet/{petId})
**Steps:**
1. Send GET request to `/pet/999999999999` (non-existent ID)
2. Verify response status is 404

**Expected Results:**
- Response status: 404 Not Found
- Error message indicates pet not found

#### 1.4 Find Pets by Status (GET /pet/findByStatus)
**Steps:**
1. Send GET request to `/pet/findByStatus?status=available`
2. Verify response status is 200
3. Verify response is an array
4. Verify all returned pets have status "available"

**Expected Results:**
- Response status: 200 OK
- Response is an array of pets
- All pets have `status: "available"`

#### 1.5 Update Pet (PUT /pet)
**Steps:**
1. Create a new pet
2. Send PUT request with updated name
3. Verify response status is 200
4. GET the pet and verify name was updated

**Expected Results:**
- Response status: 200 OK
- Pet name is successfully updated

#### 1.6 Delete Pet (DELETE /pet/{petId})
**Steps:**
1. Create a new pet
2. Send DELETE request to `/pet/{petId}`
3. Verify response status is 200
4. GET the pet and verify it returns 404

**Expected Results:**
- Delete response status: 200 OK
- Subsequent GET returns 404

---

### 2. Store Operations

#### 2.1 Get Store Inventory (GET /store/inventory)
**Steps:**
1. Send GET request to `/store/inventory`
2. Verify response status is 200
3. Verify response is an object with status counts

**Expected Results:**
- Response status: 200 OK
- Response contains inventory counts by status

#### 2.2 Place an Order (POST /store/order)
**Steps:**
1. Send POST request to `/store/order` with valid order data
2. Verify response status is 200
3. Verify response contains order ID and pet ID

**Expected Results:**
- Response status: 200 OK
- Order ID is returned
- Order status is correct

#### 2.3 Get Order by ID (GET /store/order/{orderId})
**Steps:**
1. Place a new order first
2. Send GET request to `/store/order/{orderId}`
3. Verify response status is 200
4. Verify order details match

**Expected Results:**
- Response status: 200 OK
- Order data matches created order

#### 2.4 Get Non-Existent Order (GET /store/order/{orderId})
**Steps:**
1. Send GET request to `/store/order/999999999` (non-existent)
2. Verify response status is 404

**Expected Results:**
- Response status: 404 Not Found

#### 2.5 Delete Order (DELETE /store/order/{orderId})
**Steps:**
1. Place a new order
2. Send DELETE request to `/store/order/{orderId}`
3. Verify response status is 200
4. GET the order and verify it returns 404

**Expected Results:**
- Delete response status: 200 OK
- Subsequent GET returns 404

---

### 3. User Operations

#### 3.1 Create User (POST /user)
**Steps:**
1. Send POST request to `/user` with valid user data
2. Verify response status is 200
3. Verify response indicates success

**Expected Results:**
- Response status: 200 OK
- User is created successfully

#### 3.2 Get User by Username (GET /user/{username})
**Steps:**
1. Create a user first
2. Send GET request to `/user/{username}`
3. Verify response status is 200
4. Verify user data matches

**Expected Results:**
- Response status: 200 OK
- User data is returned correctly

#### 3.3 Get Non-Existent User (GET /user/{username})
**Steps:**
1. Send GET request to `/user/nonexistent_user_xyz123`
2. Verify response status is 404

**Expected Results:**
- Response status: 404 Not Found

#### 3.4 User Login (GET /user/login)
**Steps:**
1. Send GET request to `/user/login?username=test&password=test`
2. Verify response status is 200
3. Verify response contains session info

**Expected Results:**
- Response status: 200 OK
- Session/rate limit headers returned

#### 3.5 User Logout (GET /user/logout)
**Steps:**
1. Send GET request to `/user/logout`
2. Verify response status is 200

**Expected Results:**
- Response status: 200 OK
- Logout successful

#### 3.6 Update User (PUT /user/{username})
**Steps:**
1. Create a user
2. Send PUT request with updated data
3. Verify response status is 200
4. GET the user and verify update

**Expected Results:**
- Response status: 200 OK
- User data is updated

#### 3.7 Delete User (DELETE /user/{username})
**Steps:**
1. Create a user
2. Send DELETE request to `/user/{username}`
3. Verify response status is 200
4. GET the user and verify 404

**Expected Results:**
- Delete response status: 200 OK
- Subsequent GET returns 404

---

## Test Data Requirements

### Pet Test Data
```json
{
  "name": "TestDog",
  "photoUrls": ["https://example.com/photo.jpg"],
  "status": "available",
  "category": { "id": 1, "name": "Dogs" },
  "tags": [{ "id": 1, "name": "friendly" }]
}
```

### Order Test Data
```json
{
  "petId": 1,
  "quantity": 1,
  "shipDate": "2025-11-28T10:00:00.000Z",
  "status": "placed",
  "complete": false
}
```

### User Test Data
```json
{
  "username": "testuser",
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "1234567890",
  "userStatus": 1
}
```

---

## Priority Matrix

| Priority | Scenario | Risk Level |
|----------|----------|------------|
| P0 | Create Pet | High |
| P0 | Get Pet by ID | High |
| P0 | Place Order | High |
| P1 | Find Pets by Status | Medium |
| P1 | Get Store Inventory | Medium |
| P1 | Create User | Medium |
| P2 | Update/Delete operations | Low |
| P2 | Error scenarios (404) | Low |

---

## Environment

- **API Base URL**: `https://petstore.swagger.io/v2`
- **Test Framework**: Playwright (API testing with `request` context)
- **Output**: `tests/api/*.spec.ts`

