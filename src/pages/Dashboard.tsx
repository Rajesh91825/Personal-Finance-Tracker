import React, { useEffect, useState } from "react";
import api from "../services/api";
import { rupee } from "../utils/format";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/transactions");
        setTransactions(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const totalIncome = transactions
    .filter((t) => t.category_type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.category_type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  const weeklyTrend = transactions.map((t) => ({
    date: new Date(t.transaction_date).toLocaleDateString(),
    income: t.category_type === "income" ? Number(t.amount) : 0,
    expense: t.category_type === "expense" ? Number(t.amount) : 0,
  }));

  const monthlyBreakdown = Object.values(
    transactions.reduce((acc: Record<string, { category: string; expense: number }>, t) => {
      if (t.category_type === "expense") {
        acc[t.category] = acc[t.category] || { category: t.category, expense: 0 };
        acc[t.category].expense += Number(t.amount);
      }
      return acc;
    }, {})
  );

  const recent = transactions.slice(0, 5);

  return (
    <div className="page">
      <h2>📊 Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded">
          <h3>Total Income</h3>
          <p className="text-2xl font-bold text-green-700">{rupee(totalIncome)}</p>
        </div>
        <div className="p-4 bg-red-100 rounded">
          <h3>Total Expense</h3>
          <p className="text-2xl font-bold text-red-700">{rupee(totalExpense)}</p>
        </div>
        <div className="p-4 bg-blue-100 rounded">
          <h3>Net Balance</h3>
          <p className="text-2xl font-bold text-blue-700">{rupee(netBalance)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="mb-2 font-semibold">Weekly Spend Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#00C49F" />
              <Line type="monotone" dataKey="expense" stroke="#FF8042" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="mb-2 font-semibold">Monthly Spend Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="expense" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
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
          {recent.map((t) => (
            <tr key={t.id}>
              <td>{t.description}</td>
              <td
                className={
                  t.category_type === "income" ? "text-green-600" : "text-red-600"
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
    </div>
  );
}
