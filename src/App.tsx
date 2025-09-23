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
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
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

      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          </MainLayout>
        }
      />
      <Route
        path="/transactions"
        element={
          <MainLayout>
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          </MainLayout>
        }
      />
      <Route
        path="/categories"
        element={
          <MainLayout>
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          </MainLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <MainLayout>
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          </MainLayout>
        }
      />
      <Route
        path="/export"
        element={
          <MainLayout>
            <PrivateRoute>
              <Export />
            </PrivateRoute>
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
