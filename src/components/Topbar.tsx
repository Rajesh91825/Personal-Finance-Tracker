import React from "react";
import "../styles.css";

type Props = {
  user?: { name?: string; email?: string };
  onLogout?: () => void;
};

export default function Topbar({ user, onLogout }: Props) {
  const initial =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "G"; // fallback to "G" for Guest

  return (
    <div className="topbar">
      <div className="topbar-left">Welcome 👋</div>
      <div className="flex-center gap">
        <div className="avatar">{initial}</div>
        <div className="user-info">
          <span className="user-name">{user?.name || "Guest"}</span>
          <span className="user-email">{user?.email || ""}</span>
        </div>
        <button className="btn outline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
