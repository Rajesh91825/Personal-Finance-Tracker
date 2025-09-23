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

type Category = {
  id: number;
  name: string;
  type: "income" | "expense";
};

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isIncome, setIsIncome] = useState(false);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: "",
    category_id: "",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [tRes, cRes] = await Promise.all([
      api.get("/transactions"),
      api.get("/categories"),
    ]);
    setTransactions(tRes.data || []);
    setCategories(cRes.data || []);
  };

  const handleSubmit = async () => {
    if (!form.description || !form.amount || !form.date || !form.category_id) {
      alert("Please fill all fields");
      return;
    }
    await api.post("/transactions", {
      description: form.description,
      amount: Number(form.amount),
      transaction_date: form.date,
      category_id: Number(form.category_id),
    });
    setShowModal(false);
    setForm({ description: "", amount: "", date: "", category_id: "" });
    setIsIncome(false);
    load();
  };

  return (
    <div className="page">
      <h2 className="text-2xl font-semibold mb-4">💸 Transactions</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setShowModal(true)}
      >
        + Add Transaction
      </button>

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
          {transactions.map((t) => (
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add Transaction</h3>

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!isIncome}
                  onChange={() => setIsIncome(false)}
                />
                Expense
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isIncome}
                  onChange={() => setIsIncome(true)}
                />
                Income
              </label>
            </div>

            <input
              className="w-full p-2 border rounded mb-2"
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded mb-2"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded mb-2"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded mb-4"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
