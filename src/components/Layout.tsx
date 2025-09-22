import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles.css";

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const items = [
    { path: "/dashboard", label: "Dashboard", emoji: "📊" },
    { path: "/transactions", label: "Transactions", emoji: "💸" },
    { path: "/categories", label: "Categories", emoji: "📂" },
    { path: "/analytics", label: "Analytics", emoji: "📈" },
    { path: "/export", label: "Export", emoji: "⬇️" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">💰 FinTrack</div>
        <nav className="nav">
          {items.map((it) => (
            <NavLink key={it.path} to={it.path} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              <span className="nav-emoji">{it.emoji}</span>
              <span className="nav-text">{it.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">Personal Finance Tracker</div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">Welcome 👋</div>
          <div className="topbar-right">
            {user ? (
              <>
                <div className="user-info">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username || user.email || "U"}`} alt="avatar" className="avatar" />
                  <div style={{ marginLeft: 8 }}>
                    <div style={{ fontWeight: 600 }}>{user.username || user.email}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{user.email}</div>
                  </div>
                </div>
              </>
            ) : null}
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
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
