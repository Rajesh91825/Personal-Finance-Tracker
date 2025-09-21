import React from "react";
import "../styles.css";

const Dashboard: React.FC = () => {
  return (
    <div className="page">
      <h2>📊 Dashboard</h2>
      <div className="grid-3">
        <div className="card">
          <h3>Total Balance</h3>
          <p className="big-number">$12,540</p>
        </div>
        <div className="card">
          <h3>Total Income</h3>
          <p className="big-number">$7,800</p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <p className="big-number">$5,260</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
