import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle as FaUserCircleRaw } from "react-icons/fa";
import { getToken } from "../services/api";

const FaUserCircle = FaUserCircleRaw as any; // workaround for icon JSX issue in some TS setups

export default function Topbar() {
  const navigate = useNavigate();
  const token = getToken();
  const userName = localStorage.getItem("name") || (token ? "You" : "Guest");
  const email = localStorage.getItem("email") || "";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    navigate("/login");
  }

  return (
    <header className="topbar">
      <div className="topbar-left">Welcome <span role="img" aria-label="wave">👋</span></div>
      <div className="topbar-right">
        <div className="profile" title={email}>
          <div className="avatar"><FaUserCircle size={36} /></div>
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-email">{email}</div>
          </div>
          <button className="btn danger small" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
