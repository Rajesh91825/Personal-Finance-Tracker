import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { Summary, Transaction } from "../types";

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [period, setPeriod] = useState<"monthly" | "weekly">("monthly");
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/transactions/summary", { params: { period } });
        setSummary(res.data);
      } catch {
        setSummary(null);
      }
    })();
  }, [period]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/transactions");
        const list: Transaction[] = Array.isArray(res.data) ? res.data : [];
        setRecentTransactions(list.slice(0, 5));
      } catch {
        setRecentTransactions([]);
      }
    })();
  }, []);

  const goToTransactions = () => navigate("/transactions");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="border px-2 py-1 rounded"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
          <button
            onClick={goToTransactions}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            View all
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Total spending</h2>
        <div className="text-3xl font-bold mb-4">
          {summary ? `₹ ${summary.total_spending}` : "—"}
        </div>

        <h3 className="font-semibold mb-2">By category</h3>
        <table className="w-full border">
          <tbody>
            {summary?.per_category?.length ? (
              summary.per_category.map((p, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-3">{p.category}</td>
                  <td className="py-2 px-3 text-right">₹ {p.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-3 text-gray-500">No category data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Transactions</h3>
          <small className="text-sm text-gray-500">Latest 5</small>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Description</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
                <th className="py-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length ? (
                recentTransactions.map((t) => (
                  <tr key={String(t.id ?? Math.random())} className="border-b hover:bg-gray-50">
                    <td className="py-2">{t.description}</td>
                    <td className="py-2">₹{t.amount}</td>
                    <td className="py-2">
                      {t.transaction_date
                        ? new Date(t.transaction_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-2">{t.category ?? "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No recent transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
