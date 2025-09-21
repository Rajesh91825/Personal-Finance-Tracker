// src/components/Layout.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-semibold">FinTrack</Link>
          <nav className="flex items-center gap-4">
            <Link to="/transactions" className="hover:underline">Transactions</Link>
            <Link to="/categories" className="hover:underline">Categories</Link>
            <Link to="/export" className="hover:underline">Export</Link>
            {token ? (
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="text-sm px-3 py-1 border rounded"
              >Logout</button>
            ) : (
              <>
                <Link to="/login" className="text-sm px-3 py-1 border rounded">Login</Link>
                <Link to="/register" className="text-sm px-3 py-1 border rounded">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
