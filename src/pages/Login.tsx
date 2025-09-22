import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";
import AuthLayout from "../layouts/AuthLayout";
import "../styles.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn primary" onClick={handleLogin}>
          Login
        </button>
        <p className="auth-alt">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
