import React, { useEffect, useState } from "react";
import api from "../api/client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../styles.css";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  type?: "income" | "expense";
}

interface Tx {
  id: number;
  description: string;
  amount: number;
  transaction_date: string;
  category_id: number;
  category?: string;
}

const COLORS = ["#0ea5e9", "#a78bfa", "#f59e0b", "#f97316", "#ef4444", "#10b981"];

const rupee = (n: number) =>
  "₹ " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [cRes, tRes, sRes] = await Promise.all([
          api.get("/categories"),
          api.get("/transactions"),
          api.get("/transactions/summary", { params: { period: "monthly" } }),
        ]);
        setCategories(Array.isArray(cRes.data) ? cRes.data : []);
        setTransactions(Array.isArray(tRes.data) ? tRes.data : []);
        setSummary(sRes.data || null);
      } catch (err: any) {
        toast.error("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // map categories by id for quick lookup
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const totalIncome = transactions
    .filter((t) => (catMap[t.category_id]?.type || "expense") === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => (catMap[t.category_id]?.type || "expense") === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // chart data use summary.per_category if available, else compute
  const chartData =
    summary?.per_category?.length
      ? summary.per_category.map((c: any) => ({ name: c.category, value: Number(c.total) }))
      : Object.values(
          transactions
            .filter((t) => (catMap[t.category_id]?.type || "expense") === "expense")
            .reduce((acc: any, t) => {
              const name = catMap[t.category_id]?.name || "Others";
              acc[name] = (acc[name] || 0) + Number(t.amount);
              return acc;
            }, {})
        ).map((val: any, idx: number) => ({ name: Object.keys(val)[0], value: Object.values(val)[0] }));

  return (
    <div className="page">
      <h2>📊 Dashboard</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="grid-3">
            <div className="card">
              <h3>Total Balance</h3>
              <p className="big-number">{rupee(balance)}</p>
            </div>
            <div className="card">
              <h3>Total Income</h3>
              <p className="big-number">{rupee(totalIncome)}</p>
            </div>
            <div className="card">
              <h3>Total Expenses</h3>
              <p className="big-number">{rupee(totalExpenses)}</p>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>Spending by Category (Monthly)</h3>
            {chartData && chartData.length ? (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie dataKey="value" isAnimationActive={false} data={chartData} outerRadius={100} label>
                      {chartData.map((_: any, idx: number) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => rupee(Number(val))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="muted">Not enough data to render chart.</p>
            )}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>Recent Transactions</h3>
            {transactions.slice(0, 6).length ? (
              <ul className="list">
                {transactions.slice(0, 6).map((t) => (
                  <li key={t.id} className="list-item">
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.description}</div>
                      <div className="muted" style={{ fontSize: 13 }}>
                        {catMap[t.category_id]?.name || "Others"} • {new Date(t.transaction_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>{rupee(Number(t.amount))}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No recent transactions yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
