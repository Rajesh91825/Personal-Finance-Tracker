import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import "../styles.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("rajesh@example.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data?.token;
      if (!token) throw new Error("No token returned");
      login(token);
      toast.success("Logged in");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>🔐 Login</h2>
        <input type="email" placeholder="Email" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
    </div>
  );
};

export default Login;
