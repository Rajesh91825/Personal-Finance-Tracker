// src/pages/Transactions.tsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import { toast } from "react-hot-toast";
import { rupee } from "../helpers/format";

type Transaction = {
  id: number;
  description: string;
  amount: string | number;
  transaction_date: string;
  category: string;
  category_id?: number;
};

type Category = { id: number; name: string };

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    transaction_date: "",
    category_id: "",
  });

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data || []);
    } catch (e) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }
  async function fetchCategories() {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  }

  useEffect(() => {
    fetchAll();
    fetchCategories();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm({ description: "", amount: "", transaction_date: "", category_id: "" });
    setOpen(true);
  }
  function openEdit(tx: Transaction) {
    setEditing(tx);
    setForm({
      description: tx.description,
      amount: String(tx.amount),
      transaction_date: tx.transaction_date.slice(0, 10),
      category_id: String(tx.category_id || ""),
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      description: form.description,
      amount: Number(form.amount),
      transaction_date: form.transaction_date,
      category_id: Number(form.category_id),
    };
    try {
      if (editing) {
        await api.put(`/transactions/${editing.id}`, payload);
        toast.success("Transaction updated ✅");
      } else {
        await api.post("/transactions", payload);
        toast.success("Transaction added ✅");
      }
      setOpen(false);
      fetchAll();
    } catch {
      toast.error("Failed to save transaction ❌");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted ✅");
      fetchAll();
    } catch {
      toast.error("Failed to delete transaction ❌");
    }
  }

  return (
    <div className="container">
      <div className="page-title">
        <span>💸</span>
        <div>Transactions</div>
      </div>

      <div className="card mb-6">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="text-muted">Manage your expenses and income</div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Transaction</button>
        </div>

        <div className="mt-2">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.description}</td>
                    <td>{rupee(Number(t.amount))}</td>
                    <td>{t.transaction_date.slice(0, 10)}</td>
                    <td>{t.category}</td>
                    <td>
                      <button className="btn btn-ghost" onClick={() => openEdit(t)} style={{ marginRight: 8 }}>✏️ Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(t.id)}>🗑 Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 style={{ marginBottom: 12 }}>{editing ? "Edit Transaction" : "Add Transaction"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
              <input className="input" placeholder="Description" value={form.description} required
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input className="input" type="number" placeholder="Amount" value={form.amount} required
                onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <input className="input" type="date" placeholder="Date" value={form.transaction_date} required
                onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} />
              <select className="select" value={form.category_id} required
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
