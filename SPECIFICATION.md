# Inventory Management System Specification

This document outlines the technical design for the Inventory Management System. It includes specifications for the API, database, screens, and additional considerations.

---

## 1. API Specification

### 1.1. Authentication & Authorization

- **Endpoint:** `/api/auth/[...nextauth]`
  - **Methods:** GET, POST
  - **Providers:** Credentials, Google, GitHub
  - **Cookies:**
    - Name: `next-auth.session-token`
    - Secure in production
  - **Session:**
    - JWT-based with an 8-hour expiration

### 1.2. Product Management

- **Endpoint:** `/api/products/`
  - **GET (Owner)**
    - **Description:** Retrieves products owned by the authenticated company.
    - **Response:** A list of product records including product name, SKU, price, quantity, description, associated warehouse name, and supplier name.
  - **POST (Register Product)**
    - **Description:** Registers a new product.
    - **Payload Example:**
      ```json
      {
        "product_name": "Example Product",
        "description": "Product description",
        "price": 100.00,
        "quantity": 50,
        "warehouse_id": 3,
        "new_warehouse_name": "",
        "new_warehouse_location": ""
      }
      ```
    - **Response:** The created product record.
  - **PUT / DELETE:** Update and delete product by ID using `/api/products/:id/`.

- **Endpoint:** `/api/products/purchase/`
  - **GET (Buyer)**
    - **Description:** Retrieves products from other companies only if a permission request exists and is marked as `permitted`.
    - **Response:** A list of permitted products for purchase based on permission requests.

### 1.3. Warehouse & Inventory Management

- **Endpoint:** `/api/warehouses/`
  - **POST:** Creates a new warehouse.
  - **GET:** Retrieves a list of warehouses.

- **Endpoint:** `/api/inventory-stock/`
  - Functionality to track product inventory by warehouse.

### 1.4. Permission Requests

- **Endpoint:** `/api/requests/`
  - **POST (Send Request):**
    - **Description:** Allows a user (buyer) to send a permission request to view another user's products.
    - **Payload:** Contains requester and seller identifiers.
  - **Endpoint:** `/api/requests/search`
    - **GET:** Searches for permission requests based on query parameters (e.g., phone, email).
  - **Endpoint:** `/api/requests/:id/`
    - **PUT:** Updates the request status (e.g., changes status to `permitted`).

### 1.5. User Registration

- **Endpoint:** `/api/register/`
  - **POST:** Registers a new user/company.
  - **Payload Example:**
    ```json
    {
      "name": "Company Name",
      "address": "Address",
      "phone": "Phone number",
      "email": "email@example.com",
      "password": "encrypted_password",
      "status": "active"
    }
    ```

---

## 2. Database Specification

### 2.1. Main Entities

#### Companies
- **Fields:**
  - `id` (primary key, uint)
  - `name` (string)
  - `email` (string, unique)
  - `password` (hashed string)
  - `phone` (string)
  - `address` (string)
  - `status` (active/inactive)

#### Products
- **Fields:**
  - `id` (primary key, uint)
  - `product_name` (string)
  - `sku` (string, unique)
  - `description` (string)
  - `price` (float)
  - `supplier_id` (uint, foreign key referencing Companies)
  - `status` (string)
  - GORM default fields (`created_at`, `updated_at`, `deleted_at`)

#### InventoryStock
- **Fields:**
  - `id` (primary key, uint)
  - `product_id` (uint, foreign key referencing Products)
  - `warehouse_id` (uint, foreign key referencing Warehouses)
  - `quantity_in_stock` (uint)

#### Warehouses
- **Fields:**
  - `id` (primary key, uint)
  - `warehouse_name` (string)
  - `location` (string)

#### PermissionRequests
- **Fields:**
  - `id` (primary key, uint)
  - `seller_id` (uint, foreign key referencing Companies)
  - `requester_id` (uint, foreign key referencing Companies)
  - `status` (string: pending, permitted, rejected)
  - `created_at`, `updated_at`

### 2.2. Relationships and Constraints

- **Companies & Products:** One-to-many (a company owns multiple products).
- **Warehouses & InventoryStock:** One-to-many relationship.
- **PermissionRequests:** Models a relationship between two companies.

---

## 3. Screen Specification

### 3.1. Landing / Home Screen
- **URL:** `/`
- **Components:**
  - Welcome message "Inventory Management System"
  - **Actions:** "Sign In" and "Sign Up" buttons
  - Clean and centered layout

### 3.2. Authentication Screens

#### Login Page
- **URL:** `/login`
- **Components:**
  - Email and password input fields
  - Social sign-in options (Google, GitHub)
  - Error messaging
  - Upon successful login, redirect to `/dashboard`

#### Registration Page
- **URL:** `/register`
- **Components:**
  - Fields: Company Name, Address, Phone, Email, Password
  - Validation and error messaging
  - Redirect to login on successful registration

### 3.3. Dashboard & Navigation

- **URL:** `/dashboard`
- **Components:**
  - Consistent header with navigation toggle (visible only when logged in)
  - Navigation links: Products, Warehouse, Requests, Sales, Settings, etc.
  - Overview panels for analytics (optional)

### 3.4. Product Screens

#### Product List
- **Components:**
  - List view of products owned by the logged-in company
  - Options to update or delete

#### Product Registration
- **Components:**
  - Form to enter product details
  - Dropdown to select existing warehouse with an option to “Add New Warehouse”
  - Automatic SKU generation and field validations

### 3.5. Warehouse & Inventory Screens

- **Components:**
  - Warehouse list to view, add, update, or delete warehouses
  - Inventory details showing product stock per warehouse

### 3.6. Permission Request Screens

#### Send Request Screen
- **URL:** `/requests/send`
- **Components:**
  - Form to send permission request
  - Fields include target seller identifier and message

#### Search Request Screen
- **URL:** `/requests/search`
- **Components:**
  - Form to search incoming permission requests (for sellers)
  - Listings of requests with controls to update status (e.g., permit a request)

---

## 4. Additional Considerations

- **User Profile & Settings:**
  - Screen for updating account and company details.
  - May also include password changes and notification settings.

- **Error and Not Found Pages:**
  - Custom 404 and error handler pages for a smoother user experience.

- **Responsive Design:**
  - Ensure the UI is mobile-friendly with responsive layout adjustments.

- **Security:**
  - Secure endpoints with robust authentication.
  - Use HTTPS and secure cookie settings.
  - CORS and reverse proxy configurations as needed.

- **Performance & Caching:**
  - Consider API response caching where appropriate.
  - Add database indexing on frequently queried fields such as `company_id` and `sku`.

- **Documentation:**
  - Maintain API documentation using tools like Swagger/OpenAPI.
  - Keep the documentation version controlled alongside the codebase.

- **Collaboration:**
  - Manage this specification in Markdown stored in your repository.
  - Alternatively, you could use a Wiki such as Confluence or Notion if dynamic documentation is required.

---

*This Markdown document serves as a living document and should be updated as the application evolves.*