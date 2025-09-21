// src/pages/TransactionsList.tsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import { Transaction } from "../types";
import { Link, useNavigate } from "react-router-dom";

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      alert("Failed to load transactions");
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      alert("Deleted");
      load();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Transactions</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate("/transactions/new")} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          <button onClick={() => load()} className="px-3 py-1 border rounded">Refresh</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="py-2">Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-t">
                <td className="py-2">{t.transaction_date}</td>
                <td>{t.description}</td>
                <td>{t.category || (t.category_id ? `#${t.category_id}` : "—")}</td>
                <td>₹ {t.amount}</td>
                <td className="text-right">
                  <Link to={`/transactions/${t.id}/edit`} className="mr-2 text-blue-600">Edit</Link>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
