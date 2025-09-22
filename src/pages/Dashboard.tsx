import React, { useEffect, useState } from "react";
import api from "../services/api";

type Transaction = {
  id: number;
  amount: number | string;
  category: string;
  category_type: "income" | "expense";
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/transactions");
        setTransactions(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.category_type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.category_type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="page">
      <h2>📊 Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Income</h3>
          <p className="text-2xl font-bold text-green-700">
            ₹{Number(totalIncome).toFixed(2)}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Expense</h3>
          <p className="text-2xl font-bold text-red-700">
            ₹{Number(totalExpense).toFixed(2)}
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Net Balance</h3>
          <p className="text-2xl font-bold text-blue-700">
            ₹{Number(netBalance).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
