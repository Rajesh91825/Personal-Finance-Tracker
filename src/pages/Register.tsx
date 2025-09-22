import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";
import AuthLayout from "../layouts/AuthLayout";
import "../styles.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", form);
      toast.success("Registered! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2>Create Account</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <button className="btn success" onClick={handleRegister}>
          Register
        </button>
        <p className="auth-alt">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
