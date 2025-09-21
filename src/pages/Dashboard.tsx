// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import { Summary } from "../types";

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [period, setPeriod] = useState<"monthly" | "weekly">("monthly");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/transactions/summary", { params: { period } });
        setSummary(res.data);
      } catch (err: any) {
        alert("Failed to load summary");
      }
    })();
  }, [period]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <select value={period} onChange={e => setPeriod(e.target.value as any)} className="border px-2 py-1 rounded">
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Total spending</h2>
        <div className="text-3xl font-bold mb-4">{summary ? `₹ ${summary.total_spending}` : "—"}</div>

        <h3 className="font-semibold mb-2">By category</h3>
        <ul className="space-y-2">
          {summary?.per_category?.map((p, idx) => (
            <li key={idx} className="flex justify-between border-b py-2">
              <span>{p.category}</span>
              <span>₹ {p.total}</span>
            </li>
          )) || <li>No data</li>}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
