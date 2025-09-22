import React, { useEffect, useState } from "react";
import api from "../api/client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import "../styles.css";

const COLORS = ["#0ea5e9", "#a78bfa", "#f59e0b", "#f97316", "#ef4444", "#10b981"];

const rupee = (n: number) =>
  "₹ " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Analytics: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [unusual, setUnusual] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState<number | "">("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const sRes = await api.get("/transactions/summary", { params: { period: "monthly" } });
        setSummary(sRes.data || null);
        const uRes = await api.get("/transactions/unusual");
        setUnusual(uRes.data || null);
        setThreshold(uRes.data?.threshold ?? "");
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = summary?.per_category?.map((c: any) => ({ name: c.category, value: Number(c.total) })) || [];

  const applyThreshold = async () => {
    try {
      const uRes = await api.get("/transactions/unusual", { params: { threshold } });
      setUnusual(uRes.data || null);
      toast.success("Unusual transactions refreshed");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch unusual transactions");
    }
  };

  return (
    <div className="page">
      <h2>📈 Analytics</h2>
      {loading ? <p>Loading…</p> : (
        <>
          <div className="card">
            <h3>Total Spending: {summary ? rupee(Number(summary.total_spending || 0)) : rupee(0)}</h3>
            <div style={{ width: "100%", height: 320 }}>
              {chartData.length ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie dataKey="value" data={chartData} nameKey="name" outerRadius={120} label>
                        {chartData.map((_: any, idx: number) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(val:any) => rupee(Number(val))} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="muted">Not enough data to render chart.</p>}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>⚠️ Unusual Transactions</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="number" placeholder="Threshold" value={threshold as any} onChange={(e) => setThreshold(e.target.value ? Number(e.target.value) : "")} />
              <button className="btn-primary" onClick={applyThreshold}>Apply</button>
            </div>

            <div style={{ marginTop: 12 }}>
              {unusual && unusual.unusual_transactions && unusual.unusual_transactions.length ? (
                <ul className="list">
                  {unusual.unusual_transactions.map((t: any) => (
                    <li key={t.id} className="list-item">
                      <div>
                        <div style={{ fontWeight: 600 }}>{t.description}</div>
                        {t.transaction_date && <div className="muted" style={{ fontSize: 12 }}>{new Date(t.transaction_date).toLocaleDateString()}</div>}
                      </div>
                      <div style={{ color: "#ef4444", fontWeight: 700 }}>{rupee(Number(t.amount))}</div>
                    </li>
                  ))}
                </ul>
              ) : <p className="muted">No unusual transactions found.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
