import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if (res?.token) {
        localStorage.setItem("token", res.token);
        // optional name/email if backend returns them
        if (res.user?.username) localStorage.setItem("name", res.user.username);
        if (res.user?.email) localStorage.setItem("email", res.user.email);
        toast.success("Logged in ✅");
        nav("/dashboard");
      } else {
        toast.error("Login failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login error");
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h2>Sign In</h2>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn primary" type="submit">Login</button>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
