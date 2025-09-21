import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../styles.css";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", emoji: "📊" },
  { path: "/transactions", label: "Transactions", emoji: "💸" },
  { path: "/categories", label: "Categories", emoji: "📂" },
  { path: "/analytics", label: "Analytics", emoji: "📈" },
  { path: "/export", label: "Export", emoji: "⬇️" },
];

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">FinTrack</div>
        <nav className="nav">
          {navItems.map((n) => (
            <NavLink
              to={n.path}
              key={n.path}
              className={({ isActive }) => "nav-link" + (isActive ? " nav-link-active" : "")}
            >
              <span className="nav-emoji">{n.emoji}</span>
              <span className="nav-text">{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">v1.0</div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">📌 Personal Finance Tracker</div>
          <div className="topbar-right">
            <img src="https://i.pravatar.cc/40" alt="avatar" className="avatar" />
            <button className="btn-logout" onClick={() => { logout(); navigate("/login"); }}>
              Logout
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
