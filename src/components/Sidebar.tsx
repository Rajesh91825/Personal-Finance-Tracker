import React from "react";
import { NavLink } from "react-router-dom";
import { FaTable } from "react-icons/fa";

const links = [
  { to: "/dashboard", label: "Dashboard", emoji: "📊" },
  { to: "/transactions", label: "Transactions", emoji: "💸" },
  { to: "/categories", label: "Categories", emoji: "📁" },
  { to: "/analytics", label: "Analytics", emoji: "📈" },
  { to: "/export", label: "Export", emoji: "⬇️" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="logo-emoji">🪙</span>
        <span className="brand-text">FinTrack</span>
      </div>

      <nav className="nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <span className="nav-emoji">{l.emoji}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">Personal Finance Tracker</div>
    </aside>
  );
}
