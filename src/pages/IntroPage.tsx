import React from "react";
import { Link } from "react-router-dom";

const IntroPage: React.FC = () => {
  return (
    <div className="center-page">
      <div className="card promo-card">
        <h1>Welcome to FinTrack</h1>
        <p className="muted">
          Track expenses, manage categories, and view insights — all in one place.
        </p>
        <div className="cta-row">
          <Link to="/register" className="btn btn-primary">Get started</Link>
          <Link to="/login" className="btn btn-outline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
