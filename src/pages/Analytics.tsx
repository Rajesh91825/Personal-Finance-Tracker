import React, { useEffect, useState } from "react";
import api from "../api/client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../styles.css";

interface SummaryResponse {
  total_spending: string;
  per_category: { category: string; total: string }[];
}

interface UnusualResponse {
  threshold: number;
  unusual_transactions: { id: number; description: string; amount: number; transaction_date?: string }[];
}

const COLORS = ["#0ea5e9", "#a78bfa", "#f59e0b", "#f97316", "#ef4444", "#10b981"];

const Analytics: React.FC = () => {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [unusual, setUnusual] = useState<UnusualResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sRes, uRes] = await Promise.all([
          api.get("/transactions/summary", { params: { period: "monthly" } }),
          api.get("/transactions/unusual"),
        ]);
        setSummary(sRes.data || null);
        setUnusual(uRes.data || null);
      } catch (err) {
        console.error("analytics fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <h2>📈 Analytics</h2>

      {loading ? (
        <p>Loading analytics…</p>
      ) : (
        <>
          <div className="card">
            <h3>Total Spending: ${summary?.total_spending ?? "0.00"}</h3>
            <div style={{ width: "100%", height: 320 }}>
              {summary && summary.per_category.length ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={summary.per_category} dataKey="total" nameKey="category" outerRadius={120} label>
                      {summary.per_category.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="muted">Not enough data to render chart.</p>
              )}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>⚠️ Unusual Transactions</h3>
            {unusual && unusual.unusual_transactions && unusual.unusual_transactions.length ? (
              <ul className="list">
                {unusual.unusual_transactions.map((t) => (
                  <li key={t.id} className="list-item">
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.description}</div>
                      {t.transaction_date && <div className="muted" style={{ fontSize: 13 }}>{new Date(t.transaction_date).toLocaleDateString()}</div>}
                    </div>
                    <div style={{ color: "#ef4444", fontWeight: 700 }}>${Number(t.amount).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No unusual transactions found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
