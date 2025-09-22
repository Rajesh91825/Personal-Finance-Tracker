import React, { useEffect, useState } from "react";
import api from "../api/client";

interface Category {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number | string;
  transaction_date: string;
  category: { id: string; name: string };
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    const res = await api.get("/transactions");
    const data = Array.isArray(res.data) ? res.data : [];
    // ensure amounts are numbers
    setTransactions(
      data.map((t) => ({
        ...t,
        amount: Number(t.amount),
      }))
    );
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data || []);
  };

  const handleAddTransaction = async () => {
    if (!description || !amount || !date || !categoryId) return;

    await api.post("/transactions", {
      description,
      amount: Number(amount),
      transaction_date: date,
      category_id: categoryId,
    });

    setIsModalOpen(false);
    setDescription("");
    setAmount("");
    setDate("");
    setCategoryId("");
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    await api.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">💸 Transactions</h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        + Add Transaction
      </button>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Description</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            <th className="p-2">Category</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="p-2">{t.description}</td>
              <td className="p-2">₹{Number(t.amount).toFixed(2)}</td>
              <td className="p-2">
                {t.transaction_date
                  ? new Date(t.transaction_date).toLocaleDateString()
                  : "—"}
              </td>
              <td className="p-2">{t.category?.name}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal outside table */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add Transaction</h3>

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded mb-2"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded mb-2"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              className="w-full p-2 border rounded mb-4"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
