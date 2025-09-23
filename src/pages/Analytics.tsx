import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  transaction_date: string;
  category: string;
  category_type: "income" | "expense";
};

type ChartData = { name: string; value: number };

export default function Analytics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [unusual, setUnusual] = useState<Transaction[]>([]);

  useEffect(() => {
    const load = async () => {
      const [tRes, uRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/transactions/unusual?period=monthly&multiplier=2"),
      ]);
      setTransactions(tRes.data || []);
      setUnusual(uRes.data.unusual_transactions || []);
    };
    load();
  }, []);

  const incomeByCategory: ChartData[] = Object.values(
    transactions
      .filter((t) => t.category_type === "income")
      .reduce((acc: Record<string, ChartData>, t) => {
        acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
        acc[t.category].value += Number(t.amount);
        return acc;
      }, {})
  );

  const expenseByCategory: ChartData[] = Object.values(
    transactions
      .filter((t) => t.category_type === "expense")
      .reduce((acc: Record<string, ChartData>, t) => {
        acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
        acc[t.category].value += Number(t.amount);
        return acc;
      }, {})
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

  return (
    <div className="page">
      <h2>📈 Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="mb-2 font-semibold">Income Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeByCategory}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {incomeByCategory.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="mb-2 font-semibold">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {expenseByCategory.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={expenseByCategory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>

      <h3 className="text-lg font-semibold mt-6 mb-2">Unusual Transactions</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {unusual.map((t) => (
            <tr key={t.id}>
              <td>{t.description}</td>
              <td className="text-red-600">-{t.amount}</td>
              <td>{new Date(t.transaction_date).toLocaleDateString()}</td>
              <td>{t.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
