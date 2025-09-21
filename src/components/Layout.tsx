import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles.css";

const navItems = [
  { path: "/dashboard", label: "Dashboard", emoji: "📊" },
  { path: "/transactions", label: "Transactions", emoji: "💸" },
  { path: "/categories", label: "Categories", emoji: "📂" },
  { path: "/analytics", label: "Analytics", emoji: "📈" },
  { path: "/export", label: "Export", emoji: "⬇️" },
];

const Layout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear whatever auth you use
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">FinTrack</div>
        <nav className="nav">
          {navItems.map((n) => (
            <Link
              key={n.path}
              to={n.path}
              className="nav-link"
              aria-label={n.label}
            >
              <span className="nav-emoji">{n.emoji}</span>
              <span className="nav-text">{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">v1.0</div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="topbar-btn"
              onClick={() => navigate("/dashboard")}
              title="Go to dashboard"
            >
              Home
            </button>
          </div>

          <div className="topbar-right">
            <div className="profile">
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="avatar"
              />
              <span className="profile-name">User</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
