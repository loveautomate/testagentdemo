# SauceDemo Application - Comprehensive Test Plan

## Application Overview

SauceDemo (https://www.saucedemo.com/) is a sample e-commerce web application designed for testing purposes. The application provides:

- **Authentication**: Login functionality with multiple test user accounts
- **Product Catalog**: Inventory page displaying 6 products with sorting capabilities
- **Product Details**: Individual product pages with detailed descriptions
- **Shopping Cart**: Add/remove items, view cart contents
- **Checkout Flow**: Multi-step checkout process (information → overview → completion)
- **Navigation**: Hamburger menu with logout, reset state, and navigation options

### Available Test Users
- `standard_user` - Normal user account
- `locked_out_user` - Locked account (should fail login)
- `problem_user` - Account with UI issues
- `performance_glitch_user` - Account with slow responses
- `error_user` - Account that triggers errors
- `visual_user` - Account with visual differences

**Password for all users**: `secret_sauce`

---

## Test Scenarios

### 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1 Successful Login with Standard User
**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Enter username "standard_user" in the Username field
3. Enter password "secret_sauce" in the Password field
4. Click the "Login" button

**Expected Results:**
- User is redirected to /inventory.html
- Products page displays with 6 items
- "Products" header is visible
- Shopping cart icon is visible in header

#### 1.2 Login with Locked Out User
**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Enter username "locked_out_user" in the Username field
3. Enter password "secret_sauce" in the Password field
4. Click the "Login" button

**Expected Results:**
- Error message appears: "Epic sadface: Sorry, this user has been locked out."
- User remains on login page
- URL does not change

#### 1.3 Login with Invalid Credentials
**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Enter username "invalid_user" in the Username field
3. Enter password "wrong_password" in the Password field
4. Click the "Login" button

**Expected Results:**
- Error message appears indicating invalid credentials
- User remains on login page

#### 1.4 Login with Empty Fields
**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Leave username field empty
3. Leave password field empty
4. Click the "Login" button

**Expected Results:**
- Error message appears: "Epic sadface: Username is required"

---

### 2. Product Inventory

**Seed:** `tests/seed.spec.ts` (requires login first)

#### 2.1 Verify Product Display
**Steps:**
1. Login as standard_user
2. Observe the Products page

**Expected Results:**
- 6 products are displayed
- Each product shows: name, description, price, and "Add to cart" button
- Products are sorted alphabetically (A to Z) by default

#### 2.2 Sort Products by Price (Low to High)
**Steps:**
1. Login as standard_user
2. Click the sort dropdown
3. Select "Price (low to high)"

**Expected Results:**
- Products reorder with lowest price first ($7.99 Onesie)
- Highest price last ($49.99 Fleece Jacket)

#### 2.3 Sort Products by Price (High to Low)
**Steps:**
1. Login as standard_user
2. Click the sort dropdown
3. Select "Price (high to low)"

**Expected Results:**
- Products reorder with highest price first ($49.99 Fleece Jacket)
- Lowest price last ($7.99 Onesie)

#### 2.4 Sort Products by Name (Z to A)
**Steps:**
1. Login as standard_user
2. Click the sort dropdown
3. Select "Name (Z to A)"

**Expected Results:**
- Products reorder alphabetically in reverse order
- "Test.allTheThings() T-Shirt (Red)" appears first

---

### 3. Shopping Cart

**Seed:** `tests/seed.spec.ts` (requires login first)

#### 3.1 Add Single Item to Cart
**Steps:**
1. Login as standard_user
2. Click "Add to cart" on "Sauce Labs Backpack"

**Expected Results:**
- Button changes to "Remove"
- Cart badge shows "1"
- Item is added to cart

#### 3.2 Add Multiple Items to Cart
**Steps:**
1. Login as standard_user
2. Click "Add to cart" on "Sauce Labs Backpack"
3. Click "Add to cart" on "Sauce Labs Bike Light"

**Expected Results:**
- Both buttons change to "Remove"
- Cart badge shows "2"

#### 3.3 Remove Item from Cart (Inventory Page)
**Steps:**
1. Login as standard_user
2. Add "Sauce Labs Backpack" to cart
3. Click "Remove" button on the same product

**Expected Results:**
- Button changes back to "Add to cart"
- Cart badge disappears or shows "0"

#### 3.4 View Cart Contents
**Steps:**
1. Login as standard_user
2. Add "Sauce Labs Backpack" to cart
3. Click the shopping cart icon

**Expected Results:**
- Navigate to /cart.html
- Cart displays the added item with quantity, name, description, and price
- "Continue Shopping" and "Checkout" buttons are visible

#### 3.5 Remove Item from Cart Page
**Steps:**
1. Login as standard_user
2. Add item to cart
3. Go to cart page
4. Click "Remove" button

**Expected Results:**
- Item is removed from cart
- Cart becomes empty

---

### 4. Checkout Flow

**Seed:** `tests/seed.spec.ts` (requires login and items in cart)

#### 4.1 Complete Checkout - Happy Path
**Steps:**
1. Login as standard_user
2. Add "Sauce Labs Backpack" ($29.99) to cart
3. Click cart icon
4. Click "Checkout" button
5. Fill in First Name: "John"
6. Fill in Last Name: "Doe"
7. Fill in Zip/Postal Code: "12345"
8. Click "Continue" button
9. Verify order summary
10. Click "Finish" button

**Expected Results:**
- Step 5-8: Navigate to checkout-step-one.html
- Step 9: Navigate to checkout-step-two.html, shows:
  - Item: Sauce Labs Backpack
  - Item total: $29.99
  - Tax: $2.40
  - Total: $32.39
- Step 10: Navigate to checkout-complete.html
  - "Thank you for your order!" message displayed
  - "Back Home" button visible

#### 4.2 Checkout with Empty First Name
**Steps:**
1. Login and add item to cart
2. Go to checkout
3. Leave First Name empty
4. Fill Last Name and Zip Code
5. Click "Continue"

**Expected Results:**
- Error message: "Error: First Name is required"
- User stays on checkout-step-one.html

#### 4.3 Checkout with Empty Last Name
**Steps:**
1. Login and add item to cart
2. Go to checkout
3. Fill First Name, leave Last Name empty
4. Fill Zip Code
5. Click "Continue"

**Expected Results:**
- Error message: "Error: Last Name is required"

#### 4.4 Checkout with Empty Postal Code
**Steps:**
1. Login and add item to cart
2. Go to checkout
3. Fill First Name and Last Name
4. Leave Zip Code empty
5. Click "Continue"

**Expected Results:**
- Error message: "Error: Postal Code is required"

#### 4.5 Cancel Checkout
**Steps:**
1. Login and add item to cart
2. Go to checkout
3. Click "Cancel" button

**Expected Results:**
- Navigate back to cart page
- Items still in cart

---

### 5. Product Details

**Seed:** `tests/seed.spec.ts` (requires login)

#### 5.1 View Product Details
**Steps:**
1. Login as standard_user
2. Click on product name "Sauce Labs Backpack"

**Expected Results:**
- Navigate to inventory-item.html
- Product image displayed
- Product name, description, and price shown
- "Add to cart" button visible
- "Back to products" button visible

#### 5.2 Add to Cart from Product Detail Page
**Steps:**
1. Login as standard_user
2. Click on product name
3. Click "Add to cart" button

**Expected Results:**
- Button changes to "Remove"
- Cart badge shows "1"

#### 5.3 Navigate Back to Products
**Steps:**
1. Login as standard_user
2. Click on any product name
3. Click "Back to products" button

**Expected Results:**
- Navigate back to /inventory.html
- All products displayed

---

### 6. Navigation & Logout

**Seed:** `tests/seed.spec.ts` (requires login)

#### 6.1 Logout
**Steps:**
1. Login as standard_user
2. Click hamburger menu (Open Menu button)
3. Click "Logout"

**Expected Results:**
- Navigate to login page (/)
- User is logged out
- Cannot access inventory without logging in again

#### 6.2 Reset App State
**Steps:**
1. Login as standard_user
2. Add items to cart
3. Click hamburger menu
4. Click "Reset App State"

**Expected Results:**
- Cart is cleared
- All "Remove" buttons change back to "Add to cart"

---

## Test Priority

| Priority | Test Scenarios |
|----------|----------------|
| P0 (Critical) | 1.1, 3.1, 4.1 |
| P1 (High) | 1.2, 1.3, 3.4, 4.2-4.4, 6.1 |
| P2 (Medium) | 2.1-2.4, 3.2-3.5, 5.1-5.3 |
| P3 (Low) | 1.4, 6.2 |

---

## Notes

- All tests assume a fresh browser state (cleared cookies/storage)
- Tests should be independent and can run in any order
- Base URL: https://www.saucedemo.com/

