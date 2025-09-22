import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import "../styles.css";

export default function Landing() {
  return (
    <AuthLayout>
      <div className="landing-card">
        <h1 className="landing-title">💰 FinTrack</h1>
        <p className="landing-subtitle">Your personal finance tracker made simple.</p>
        <div className="landing-actions">
          <Link to="/login" className="btn primary">Login</Link>
          <Link to="/register" className="btn success">Register</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
