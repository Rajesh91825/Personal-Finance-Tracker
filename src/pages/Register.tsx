import React, { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles.css";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", { username, email, password });
      toast.success("Registered! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>📝 Register</h2>
        <input className="auth-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" className="auth-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="auth-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn-primary" type="submit" disabled={loading}>Register</button>
      </form>
    </div>
  );
};

export default Register;
