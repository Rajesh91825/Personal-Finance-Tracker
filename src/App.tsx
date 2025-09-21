// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsList";
import TransactionFormPage from "./pages/TransactionForm";
import CategoriesPage from "./pages/Categories";
import ExportPage from "./pages/Export";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute children={<DashboardPage />} />}
        />
        <Route
          path="/transactions"
          element={<ProtectedRoute children={<TransactionsPage />} />}
        />
        <Route
          path="/transactions/new"
          element={<ProtectedRoute children={<TransactionFormPage />} />}
        />
        <Route
          path="/transactions/:id/edit"
          element={<ProtectedRoute children={<TransactionFormPage />} />}
        />
        <Route
          path="/categories"
          element={<ProtectedRoute children={<CategoriesPage />} />}
        />
        <Route
          path="/export"
          element={<ProtectedRoute children={<ExportPage />} />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default App;
