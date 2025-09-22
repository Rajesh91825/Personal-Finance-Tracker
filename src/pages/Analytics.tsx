import React, { useEffect, useState } from "react";
import { summary, unusualTransactions } from "../services/api";
import { rupee } from "../utils/format";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA46BE", "#F54291"];

export default function Analytics() {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(2);
  const [unusual, setUnusual] = useState<any[]>([]);

  useEffect(()=>{ load(); }, []);

  async function load() {
    try {
      const s = await summary("monthly");
      setChartData((s.per_category || []).map((p: any)=>({ name: p.category, value: Number(p.total)})));
      setTotal(Number(s.total_spending || 0));
    } catch (err) {}
  }

  async function checkUnusual() {
    try {
      const res = await unusualTransactions("monthly", multiplier);
      setUnusual(res.unusual_transactions || []);
      toast.success("Unusual transactions fetched");
    } catch (err:any) {
      toast.error(err?.response?.data?.message || "Error");
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">📈 Analytics</h1>

      <div className="card chart-card">
        <h4>Total Spending: {rupee(total)}</h4>
        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={chartData} nameKey="name" outerRadius={120} label>
                {chartData.map((_, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(val:any) => rupee(Number(val))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h4>⚠️ Unusual Transactions</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ marginRight: 6 }}>Multiplier</label>
          <input type="number" min={1} value={multiplier} onChange={(e)=>setMultiplier(Number(e.target.value))} />
          <button className="btn primary" onClick={checkUnusual}>Apply</button>
        </div>

        {unusual.length ? (
          <table className="table" style={{ marginTop: 12 }}>
            <thead>
              <tr><th>Description</th><th>Amount</th><th>Date</th><th>Category</th></tr>
            </thead>
            <tbody>
              {unusual.map((u:any)=>(
                <tr key={u.id}>
                  <td>{u.description}</td>
                  <td>{rupee(Number(u.amount))}</td>
                  <td>{new Date(u.transaction_date).toISOString().split("T")[0]}</td>
                  <td>{u.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ marginTop: 12 }}>No unusual transactions found.</p>
        )}
      </div>
    </div>
  );
}
