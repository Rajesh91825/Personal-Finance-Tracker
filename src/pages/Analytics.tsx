// src/pages/Analytics.tsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "react-hot-toast";
import { rupee } from "../helpers/format";

const COLORS = ["#0284c7", "#06b6d4", "#f97316", "#f59e0b", "#8b5cf6", "#ef4444"];

const Analytics: React.FC = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(2);
  const [unusual, setUnusual] = useState<any[]>([]);
  const [loadingUnusual, setLoadingUnusual] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/transactions/summary?period=monthly");
        const { per_category, total_spending } = res.data;
        setChartData((per_category || []).map((c: any) => ({ name: c.category, value: Number(c.total) })));
        setTotal(Number(total_spending || 0));
      } catch {
        toast.error("Failed to load analytics summary");
      }
    })();
  }, []);

  async function fetchUnusual() {
    setLoadingUnusual(true);
    try {
      const res = await api.get(`/transactions/unusual?period=monthly&multiplier=${multiplier}`);
      setUnusual(res.data.unusual_transactions || []);
      toast.success("Unusual transactions loaded");
    } catch {
      toast.error("Failed to load unusual transactions");
    } finally {
      setLoadingUnusual(false);
    }
  }

  return (
    <div className="container">
      <div className="page-title"><span>📈</span><div>Analytics</div></div>

      <div className="card mb-6">
        <div className="text-lg">Total Spending: <strong>{rupee(total)}</strong></div>

        <div className="chart-wrap mt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={chartData} nameKey="name" outerRadius={120} label={({ name }) => name}>
                  {chartData.map((_: any, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(val: any, _name: any, entry: any) => `${entry.name}: ${rupee(Number(val))}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div>No chart data</div>}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 700 }}>⚠️ Unusual Transactions</div>
          <div className="text-muted">Multiplier</div>
          <input className="input small-input" type="number" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} />
          <button className="btn btn-primary" onClick={fetchUnusual} disabled={loadingUnusual}>{loadingUnusual ? "Loading..." : "Apply"}</button>
        </div>

        <div style={{ marginTop: 16 }}>
          {unusual.length === 0 ? <div className="text-muted">No unusual transactions found.</div> : (
            <table className="table">
              <thead>
                <tr><th>Description</th><th>Amount</th><th>Date</th><th>Category</th></tr>
              </thead>
              <tbody>
                {unusual.map((u) => (
                  <tr key={u.id}>
                    <td>{u.description}</td>
                    <td>{rupee(Number(u.amount))}</td>
                    <td>{u.transaction_date.slice(0, 10)}</td>
                    <td>{u.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
