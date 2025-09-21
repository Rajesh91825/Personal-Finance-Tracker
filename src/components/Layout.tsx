import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/client";
import "../styles.css";

interface Profile {
  username: string;
  email: string;
}

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">💰 FinTrack</div>
        <nav className="nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>📊 Dashboard</NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>💸 Transactions</NavLink>
          <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>📂 Categories</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>📈 Analytics</NavLink>
          <NavLink to="/export" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>⬇️ Export</NavLink>
        </nav>
        <div className="sidebar-footer">Personal Finance Tracker</div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">Welcome 👋</div>
          <div className="topbar-right">
            {profile && (
              <div className="user-info">
                <span className="user-name">{profile.username}</span>
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} alt="avatar" width={32} height={32} className="avatar" />
              </div>
            )}
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
