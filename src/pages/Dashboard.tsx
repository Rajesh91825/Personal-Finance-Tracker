// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { rupee } from "../utils/format";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  transaction_date: string;
  category: string;
  category_type: "income" | "expense";
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [unusuals, setUnusuals] = useState<any[]>([]);
  const [threshold, setThreshold] = useState(0);
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadUnusuals();
  }, [period]);

  const load = async () => {
    const res = await api.get("/transactions");
    const txs = res.data || [];
    setTransactions(txs);

    const totalIncome = txs
      .filter((t: Transaction) => t.category_type === "income")
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

    const totalExpense = txs
      .filter((t: Transaction) => t.category_type === "expense")
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

    setIncome(totalIncome);
    setExpense(totalExpense);
  };

  const loadUnusuals = async () => {
    try {
      const res = await api.get(
        `/transactions/unusual?period=${period}&multiplier=2`
      );
      console.log("API unusual response:", res.data);

      setUnusuals(res.data.unusual_transactions || []);
      setThreshold(res.data.threshold || 0);
    } catch (err) {
      console.error("Failed to load unusual expenses ❌", err);
    }
  };

  return (
    <div className="page">
      <h2>📊 Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded bg-green-100">
          <h3>Total Income</h3>
          <p className="text-2xl font-bold text-green-700">
            {rupee(income)}
          </p>
        </div>
        <div className="p-4 rounded bg-red-100">
          <h3>Total Expense</h3>
          <p className="text-2xl font-bold text-red-700">
            {rupee(expense)}
          </p>
        </div>
        <div className="p-4 rounded bg-blue-100">
          <h3>Net Balance</h3>
          <p className="text-2xl font-bold text-blue-700">
            {rupee(income - expense)}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <h3 className="font-semibold mb-2">Recent Transactions</h3>
      <table className="table mb-6">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice(0, 5).map((t) => (
            <tr key={t.id}>
              <td>{t.description}</td>
              <td
                className={
                  t.category_type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {t.category_type === "income" ? "+" : "-"}
                {rupee(t.amount)}
              </td>
              <td>{new Date(t.transaction_date).toLocaleDateString()}</td>
              <td>{t.category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Unusual Expenses */}
      <div className="bg-yellow-100 border border-yellow-300 rounded p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">⚠️ Unusual Expenses</h3>
          <select
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value as "weekly" | "monthly")
            }
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
          </select>
        </div>

        <p className="mb-2">
          Unusual if greater than <b>2 × avg {period} expense</b> (₹
          {threshold.toFixed(2)})
        </p>

        {unusuals.length > 0 ? (
          <ul className="list-disc pl-5">
            {unusuals.map((t) => (
              <li key={t.id}>
                {t.description} – ₹{Number(t.amount).toFixed(2)} ({t.category})
              </li>
            ))}
          </ul>
        ) : (
          <p>No unusual expenses found 🎉</p>
        )}
      </div>
    </div>
  );
}
