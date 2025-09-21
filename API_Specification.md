# 📝 Personal Finance Tracker - API Specification

**Base URL:**  http://localhost:5000

All protected endpoints require the **JWT token** in headers:  


---

## 1️⃣ Authentication

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|------------|--------------|----------|
| `/auth/register` | POST | Register a new user | `{ "username": "johndoe", "email": "john@example.com", "password": "password123" }` | `{ "message": "User registered successfully ✅" }` |
| `/auth/login` | POST | Login and get JWT token | `{ "email": "john@example.com", "password": "password123" }` | `{ "token": "JWT_TOKEN_HERE" }` |

---

## 2️⃣ Transaction Management

| Endpoint | Method | Description | Request Body / Query Params | Response |
|----------|--------|------------|----------------------------|----------|
| `/transactions` | GET | Get all transactions for logged-in user | - | `[{"id":1,"amount":"250.50","description":"Grocery","transaction_date":"2025-09-20","category":"Food"}]` |
| `/transactions/filtered` | GET | Get filtered transactions | Query Params: `startDate`, `endDate`, `category_id`, `minAmount`, `maxAmount` | Same as GET `/transactions` |
| `/transactions` | POST | Add a transaction | `{ "amount": 250.50, "description": "Grocery", "transaction_date": "2025-09-20", "category_id": 1 }` | `{ "message": "Transaction added ✅" }` |
| `/transactions/:id` | PUT | Update a transaction | `{ "amount": 300.75, "description": "Grocery + snacks", "transaction_date": "2025-09-21", "category_id": 1 }` | `{ "message": "Transaction updated ✅", "transaction": {...} }` |
| `/transactions/:id` | DELETE | Delete a transaction | - | `{ "message": "Transaction deleted ✅" }` |

---

## 3️⃣ Category Management

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|------------|--------------|----------|
| `/categories` | GET | List all categories | - | `[{"id":1,"name":"Food"},{"id":2,"name":"Rent"}]` |
| `/categories` | POST | Add a category | `{ "name": "Utilities" }` | `{ "message": "Category added ✅" }` |
| `/categories/:id` | PUT | Update a category | `{ "name": "Groceries" }` | `{ "message": "Category updated ✅" }` |
| `/categories/:id` | DELETE | Remove a category | - | `{ "message": "Category deleted ✅" }` |

---

## 4️⃣ Summary / Analytics

| Endpoint | Method | Description | Query Params | Response |
|----------|--------|------------|-------------|----------|
| `/transactions/summary` | GET | Weekly or monthly spending summary | `period=weekly` or `period=monthly` | `{ "total_spending": "671.25", "per_category": [{"category":"Food","total":"551.25"},{"category":"Rent","total":"120.00"}] }` |
| `/transactions/unusual` | GET | Transactions above threshold | - | `{ "threshold": 585.625, "unusual_transactions": [...] }` |

---

## 5️⃣ Export Transactions

| Endpoint | Method | Description | Response |
|----------|--------|------------|----------|
| `/export/csv` | GET | Export transactions in CSV | CSV file download |
| `/export/pdf` | GET | Export transactions in PDF | PDF file download |

---

## 6️⃣ Error Handling

| HTTP Code | Description |
|-----------|-------------|
| 201 | Created successfully (new transaction/category) |
| 200 | OK (successful GET, update, delete) |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (missing/invalid JWT) |
| 404 | Not Found (transaction, category, or user does not exist) |
| 500 | Internal Server Error |

---

### 7️⃣ Notes
- Dates format: `YYYY-MM-DD`  
- Amounts must be numeric.  
- Query parameters for filtered endpoints are optional.  
- JWT token required for all protected routes.  

---

