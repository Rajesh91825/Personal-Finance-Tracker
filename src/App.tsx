import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/TransactionsList";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";
import Export from "./pages/Export";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route
        path="/"
        element={
            <Landing />
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/transactions"
        element={
          <MainLayout>
            <Transactions />
          </MainLayout>
        }
      />
      <Route
        path="/categories"
        element={
          <MainLayout>
            <Categories />
          </MainLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <MainLayout>
            <Analytics />
          </MainLayout>
        }
      />
      <Route
        path="/export"
        element={
          <MainLayout>
            <Export />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
