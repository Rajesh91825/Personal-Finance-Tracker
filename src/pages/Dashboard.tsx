import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { rupee } from "../utils/format";
import "../styles.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa46be", "#f54291"];

export default function Dashboard() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [recent, setRecent] = useState<any[]>([]);
  const [categories, setCategories] = useState<number>(0);

  useEffect(() => {
    async function load() {
      try {
        const summary = await api.get("/transactions/summary?period=monthly");
        const trans = await api.get("/transactions");
        const cats = await api.get("/categories");

        setTotal(Number(summary.data?.total_spending) || 0);
        setChartData(
          summary.data?.per_category.map((c: any) => ({
            name: c.category,
            value: Number(c.total) || 0,
          })) || []
        );
        setRecent(trans.data?.slice(0, 5) || []);
        setCategories(cats.data?.length || 0);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      }
    }
    load();
  }, []);

  return (
    <div className="page dashboard-page">
      <h2>📊 Dashboard</h2>
      <div className="stats-row">
        <div className="stat-card">Total Spending {rupee(total)}</div>
        <div className="stat-card">Categories {categories}</div>
        <div className="stat-card">Recent Transactions {recent.length}</div>
      </div>

      <div className="card">
        <h3>Spending by Category (Monthly)</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                data={chartData}
                nameKey="name"
                outerRadius={100}
                label={(entry) => entry.name}
              >
                {chartData.map((_, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => rupee(Number(val))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>Recent Transactions</h3>
        {recent.length === 0 ? (
          <p>No data to show.</p>
        ) : (
          <ul>
            {recent.map((r) => (
              <li key={r.id}>
                {r.description} — {rupee(r.amount)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
