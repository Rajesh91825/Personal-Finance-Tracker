import React, { useEffect, useState } from "react";
import api from "../api/client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import "../styles.css";

interface SummaryResponse {
  total_spending: string;
  per_category: { category: string; total: string }[];
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  transaction_date: string;
  category: string;
}

const COLORS = ["#0ea5e9", "#a78bfa", "#f59e0b", "#f97316", "#ef4444", "#10b981"];

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sRes, tRes] = await Promise.all([
          api.get("/transactions/summary", { params: { period: "monthly" } }),
          api.get("/transactions"),
        ]);
        setSummary(sRes.data || null);
        // take last 6 transactions
        const txs: Transaction[] = Array.isArray(tRes.data) ? tRes.data : [];
        setRecent(txs.slice(0, 6));
      } catch (err) {
        console.error("dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalExpenses = summary ? parseFloat(summary.total_spending || "0") : 0;

  // Compute "income" by looking for categories with 'income' in the name (best-effort).
  const totalIncome = summary
    ? summary.per_category
        .filter((c) => /income|salary|credit/i.test(c.category))
        .reduce((acc, c) => acc + parseFloat(c.total), 0)
    : 0;

  const balance = totalIncome - totalExpenses;

  return (
    <div className="page">
      <h2>📊 Dashboard</h2>
      {loading ? (
        <p>Loading dashboard…</p>
      ) : (
        <>
          <div className="grid-3">
            <div className="card">
              <h3>Total Balance</h3>
              <p className="big-number">${balance.toFixed(2)}</p>
            </div>
            <div className="card">
              <h3>Total Income</h3>
              <p className="big-number">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="card">
              <h3>Total Expenses</h3>
              <p className="big-number">${totalExpenses.toFixed(2)}</p>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>Spending by Category (Monthly)</h3>
            {summary && summary.per_category.length ? (
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={summary.per_category} dataKey="total" nameKey="category" outerRadius={100} label>
                      {summary.per_category.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => `₹ ${Number(val).toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="muted">No category data available.</p>
            )}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>Recent Transactions</h3>
            <div>
              {recent.length ? (
                <ul className="list">
                  {recent.map((r) => (
                    <li key={r.id} className="list-item">
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.description}</div>
                        <div className="muted" style={{ fontSize: 13 }}>{r.category} • {new Date(r.transaction_date).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontWeight: 700 }}>${Number(r.amount).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No recent transactions yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
