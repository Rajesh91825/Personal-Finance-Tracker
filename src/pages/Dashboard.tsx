import React from "react";

type CategoryStat = { name: string; amount: number };

const categories: CategoryStat[] = [
  { name: "Transport", amount: 750 },
  { name: "Food", amount: 651.25 },
  { name: "Rent", amount: 240 },
  { name: "Entertainment", amount: 200 },
  { name: "Utilities", amount: 130 },
];

const Dashboard: React.FC = () => {
  const total = categories.reduce((s, c) => s + c.amount, 0);

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>

      <div className="grid-2 gap">
        <div className="card">
          <h3>Total spending</h3>
          <div className="big-number">₹ {total.toFixed(2)}</div>
        </div>

        <div className="card">
          <h3>Quick stats</h3>
          <ul className="stat-list">
            {categories.map((c) => (
              <li key={c.name}>
                <span>{c.name}</span>
                <span>₹ {c.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
