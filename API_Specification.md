
Personal Finance Tracker - API Specification
Base URL
http://localhost:5000

1. Authentication
1.1 Register

Endpoint: POST /auth/register
Description: Register a new user.
Request Body:

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}


Response (201 Created):

{
  "message": "User registered successfully ✅"
}

1.2 Login

Endpoint: POST /auth/login
Description: Authenticate user and get JWT token.
Request Body:

{
  "email": "john@example.com",
  "password": "password123"
}


Response (200 OK):

{
  "token": "JWT_TOKEN_HERE"
}

2. Transaction Management
2.1 Get All Transactions

Endpoint: GET /transactions
Description: Fetch all transactions for logged-in user.
Headers:

Authorization: Bearer JWT_TOKEN_HERE


Response (200 OK):

[
  {
    "id": 1,
    "amount": "250.50",
    "description": "Grocery shopping",
    "transaction_date": "2025-09-20",
    "category": "Food"
  }
]

2.2 Get Filtered Transactions

Endpoint: GET /transactions/filtered
Description: Fetch transactions with filters (optional query params).
Query Parameters (all optional):

startDate – start date (YYYY-MM-DD)

endDate – end date (YYYY-MM-DD)

category_id – category ID

minAmount – minimum amount

maxAmount – maximum amount

Headers:

Authorization: Bearer JWT_TOKEN_HERE


Response (200 OK):

[
  {
    "id": 2,
    "amount": "300.75",
    "description": "Grocery + snacks",
    "transaction_date": "2025-09-21",
    "category": "Food"
  }
]

2.3 Add Transaction

Endpoint: POST /transactions
Request Body:

{
  "amount": 250.50,
  "description": "Grocery shopping",
  "transaction_date": "2025-09-20",
  "category_id": 1
}


Response (201 Created):

{
  "message": "Transaction added ✅"
}

2.4 Update Transaction

Endpoint: PUT /transactions/:id
Request Body:

{
  "amount": 300.75,
  "description": "Grocery + snacks",
  "category_id": 1,
  "transaction_date": "2025-09-21"
}


Response (200 OK):

{
  "message": "Transaction updated ✅",
  "transaction": {
    "amount": 300.75,
    "description": "Grocery + snacks",
    "category_id": 1,
    "transaction_date": "2025-09-21"
  }
}

2.5 Delete Transaction

Endpoint: DELETE /transactions/:id
Response (200 OK):

{
  "message": "Transaction deleted ✅"
}

3. Category Management
3.1 Get Categories

Endpoint: GET /categories
Description: List all categories.
Response (200 OK):

[
  {
    "id": 1,
    "name": "Food"
  },
  {
    "id": 2,
    "name": "Rent"
  }
]

3.2 Add Category

Endpoint: POST /categories
Request Body:

{
  "name": "Utilities"
}


Response (201 Created):

{
  "message": "Category added ✅"
}

3.3 Update Category

Endpoint: PUT /categories/:id
Request Body:

{
  "name": "Groceries"
}


Response (200 OK):

{
  "message": "Category updated ✅"
}

3.4 Delete Category

Endpoint: DELETE /categories/:id
Response (200 OK):

{
  "message": "Category deleted ✅"
}

4. Summary / Analytics
4.1 Weekly / Monthly Summary

Endpoint: GET /transactions/summary?period=weekly|monthly
Response (200 OK):

{
  "total_spending": "671.25",
  "per_category": [
    {
      "category": "Food",
      "total": "551.25"
    },
    {
      "category": "Rent",
      "total": "120.00"
    }
  ]
}

4.2 Unusual Transactions

Endpoint: GET /transactions/unusual
Response (200 OK):

{
  "threshold": 585.625,
  "unusual_transactions": [
    {
      "id": 5,
      "amount": "600.00",
      "description": "High-value electronics",
      "transaction_date": "2025-09-10",
      "category": "Electronics"
    }
  ]
}

5. Export Transactions
5.1 Export CSV

Endpoint: GET /export/csv
Response: CSV file download containing all user transactions.

5.2 Export PDF

Endpoint: GET /export/pdf
Response: PDF file download containing all user transactions.

6. Error Handling
HTTP Code	Description
201	Created successfully (new transaction, category, etc.)
200	OK (successful GET, update, delete)
400	Bad Request (invalid input)
401	Unauthorized (missing/invalid JWT)
404	Not Found (transaction, category, or user does not exist)
500	Internal Server Error
7. Notes

All protected routes require JWT token in Authorization header:

Authorization: Bearer <token>


Dates should be in YYYY-MM-DD format.

Amounts should be numeric.

Optional query parameters can be omitted for filtered endpoints.
