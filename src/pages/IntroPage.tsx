import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const IntroPage: React.FC = () => {
  return (
    <div className="intro-page">
      <div className="intro-card">
        <h1 className="intro-title">💰 Welcome to FinTrack</h1>
        <p className="intro-subtitle">Your personal finance tracker made simple.</p>
        <div className="intro-actions">
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/register" className="btn-secondary">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
