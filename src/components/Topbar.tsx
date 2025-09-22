import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Topbar: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    try {
      localStorage.removeItem("token");
    } catch {}
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">FinTrack</h1>
      {token && (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Topbar;
