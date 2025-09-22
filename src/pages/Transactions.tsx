import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../services/api";
import Modal from "../components/Modal";
import Confirm from "../components/Confirm";
import { rupee } from "../utils/format";
import "../styles.css";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  transaction_date: string;
  category: string;
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: "",
    category_id: "",
  });
  const [confirmDelete, setConfirmDelete] = useState<Transaction | null>(null);

  const load = async () => {
    try {
      const [tRes, cRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/categories"),
      ]);
      setTransactions(tRes.data || []);
      setCategories(cRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        description: form.description,
        amount: Number(form.amount),
        transaction_date: form.date,
        category_id: Number(form.category_id),
      };

      if (editing) {
        await api.put(`/transactions/${editing.id}`, payload);
        toast.success("Transaction updated");
      } else {
        await api.post("/transactions", payload);
        toast.success("Transaction added");
      }
      setShowModal(false);
      setEditing(null);
      setForm({ description: "", amount: "", date: "", category_id: "" });
      load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save transaction");
    }
  };

  const remove = async (id: number) => {
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete transaction");
    }
  };

  return (
    <div className="page">
      <h2>💸 Transactions</h2>
      <button className="btn primary" onClick={() => setShowModal(true)}>
        + Add Transaction
      </button>

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
              <td>{rupee(t.amount)}</td>
              <td>{new Date(t.transaction_date).toISOString().slice(0, 10)}</td>
              <td>{t.category}</td>
              <td>
                <button
                  className="btn small"
                  onClick={() => {
                    setEditing(t);
                    setForm({
                      description: t.description,
                      amount: String(t.amount),
                      date: new Date(t.transaction_date)
                        .toISOString()
                        .slice(0, 10),
                      category_id: String(categories.find((c) => c.name === t.category)?.id || ""),
                    });
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn danger small"
                  onClick={() => setConfirmDelete(t)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal
          open={showModal}
          title={editing ? "Edit Transaction" : "Add Transaction"}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
            setForm({ description: "", amount: "", date: "", category_id: "" });
          }}
          footer={
            <>
              <button
                className="btn outline"
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  setForm({ description: "", amount: "", date: "", category_id: "" });
                }}
              >
                Cancel
              </button>
              <button className="btn primary" onClick={handleSubmit}>
                Save
              </button>
            </>
          }
        >
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Modal>
      )}

      {confirmDelete && (
        <Confirm
          open={!!confirmDelete}
          title="Delete Transaction"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => remove(confirmDelete.id)}
        >
          Are you sure you want to delete {confirmDelete.description}?
        </Confirm>
      )}
    </div>
  );
}
