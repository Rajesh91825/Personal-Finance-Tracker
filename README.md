# 💰 FinTrack – Personal Finance Tracker

**FinTrack** is a full-stack personal finance tracker designed to help users manage income, expenses, and savings effortlessly. The platform provides insights with interactive charts, unusual transaction detection, and exportable reports.

**🎥 Demo Video :** <>   

---

## ✨ Features

1. **Authentication & Security**
   - Secure JWT-based login and registration.
   - Role-based protection for routes.

2. **Transactions Management**
   - Add, view, and delete income and expenses.
   - Categorize transactions as **Income** or **Expense**.

3. **Dashboard**
   - Quick summary of Total Income, Expenses, and Balance.
   - Visual spending trends with charts.
   - Recent transactions list.

4. **Analytics**
   - Pie charts for Income and Expense breakdown by category.
   - Spending trends over time.
   - Unusual transactions detection with thresholds.

4. **Categories**
   - Create and manage categories.
   - Segregate categories as income or expense.

5. **Export Data**
   - Download your transactions as **CSV** or **PDF** with timestamped filenames.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Recharts  
- **Backend**: Node.js, Express.js  
- **Database**: PostgreSQL  
- **Authentication**: JWT  
- **Export**: CSV & PDF generation  

---

## ⚙️ Installation Instructions

Follow these steps to install and run the FinTrack - Personal Finance Tracker application:

### **1. Prerequisites**
Ensure you have the following installed:
- **Node.js** (v16+ recommended)  
- **npm** or **yarn**  
- **PostgreSQL** (running locally or via Docker)

---

### **2. Clone the Repository**
Both frontend and backend from respective branches separately

### **3. Install Dependencies**

Run the following commands:

```bash
npm install
```

---

### 4. Setup Environment Variables

Create backend/.env:

PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/fintrack
JWT_SECRET=your_jwt_secret

---

### **5. Database Setup**

1. Create a PostgreSQL database:
```sql
   CREATE DATABASE fintrack;
```
2. Run the schema file:
```sql
psql -U your_username -d fintrack -f backend/schema.sql
```

---

### **6. Start the Server**

Run the Node server:
```bash
npm run dev
```

Run the React server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

---

## 📸 **Some Images and Key Functionalities **

1. **Landing Page**

2. **Login & Register**.

3. **Dashboard**
   – Overview of income, expenses, balance with charts and unusual transaction alerts.

4. **Transactions Page**
   – Add and manage income/expense transactions with categories.

5. **Categories Page**
   – Create and manage income/expense categories.

6. **Analytics Page**
   – Visual breakdown of spending and income trends with charts.

7. **Export Page**
   – Download transactions as CSV or PDF with timestamps.

---

Let me know if you'd like any modifications or additions!
