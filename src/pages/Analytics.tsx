// src/pages/Analytics.tsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Transaction = {
  id: number;
  amount: number;
  category: string;
  category_type: "income" | "expense";
};

export default function Analytics() {
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

  const incomeByCategory: { name: string; value: number }[] = Object.values(
  transactions
    .filter((t) => t.category_type === "income")
    .reduce((acc: Record<string, { name: string; value: number }>, t) => {
      acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
      acc[t.category].value += Number(t.amount);
      return acc;
    }, {})
);

const expenseByCategory: { name: string; value: number }[] = Object.values(
  transactions
    .filter((t) => t.category_type === "expense")
    .reduce((acc: Record<string, { name: string; value: number }>, t) => {
      acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
      acc[t.category].value += Number(t.amount);
      return acc;
    }, {})
);


  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page">
      <h2>📈 Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Income Breakdown */}
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 text-green-600">Income Breakdown</h3>
          {incomeByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
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
          ) : (
            <p>No income data available</p>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Expense Breakdown</h3>
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
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
          ) : (
            <p>No expense data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
