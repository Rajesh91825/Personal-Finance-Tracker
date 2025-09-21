import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import IntroPage from "./pages/IntroPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";
import ExportPage from "./pages/Export";
import "./styles.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated area with Layout (sidebar + topbar) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/export" element={<ExportPage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<IntroPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
