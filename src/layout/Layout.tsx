import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles.css";

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <aside className="sidebar">
        <div className="logo">💰 FinTrack</div>
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>📊 Dashboard</Link>
        <Link to="/transactions" className={location.pathname === "/transactions" ? "active" : ""}>💳 Transactions</Link>
        <Link to="/categories" className={location.pathname === "/categories" ? "active" : ""}>📂 Categories</Link>
        <Link to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>📈 Analytics</Link>
        <Link to="/export" className={location.pathname === "/export" ? "active" : ""}>⬇️ Export</Link>
      </aside>

      <header className="header">
        <div className="profile">
          <span>Welcome 👋</span>
          <button className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
