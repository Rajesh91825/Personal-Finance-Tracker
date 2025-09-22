import React, { useEffect, useState } from "react";
import api from "../services/api";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

type Transaction = {
  id: number;
  amount: number;
  category: string;
  category_type: "income" | "expense";
};

export default function Analytics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/transactions");
      setTransactions(res.data || []);
    };
    fetchData();
  }, []);

  const incomeData = Object.entries(
    transactions
      .filter((t) => t.category_type === "income")
      .reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value }));

  const expenseData = Object.entries(
    transactions
      .filter((t) => t.category_type === "expense")
      .reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ["#8884d8", "#82ca9d", "#ff7f7f", "#ffc658", "#8dd1e1"];

  return (
    <div className="page">
      <h2>📈 Analytics</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-green-600 font-semibold mb-2">Income Breakdown</h3>
          {incomeData.length === 0 ? (
            <p className="text-gray-500">No income data available</p>
          ) : (
            <PieChart width={300} height={250}>
              <Pie
                data={incomeData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {incomeData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-red-600 font-semibold mb-2">Expense Breakdown</h3>
          {expenseData.length === 0 ? (
            <p className="text-gray-500">No expense data available</p>
          ) : (
            <PieChart width={300} height={250}>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {expenseData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </div>
      </div>
    </div>
  );
}
