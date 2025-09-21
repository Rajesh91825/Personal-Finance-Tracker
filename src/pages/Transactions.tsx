import React, { useEffect, useState } from "react";
import api from "../api/client";
import Modal from "../components/Modal";
import "../styles.css";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  transaction_date: string; // YYYY-MM-DD
  category: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

const formatDateForInput = (d: string) => {
  // accept d as YYYY-MM-DD or ISO
  const dObj = new Date(d);
  if (isNaN(dObj.getTime())) return d; // fallback
  const yyyy = dObj.getFullYear();
  const mm = String(dObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | "">("");

  // modal state for add/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [txDate, setTxDate] = useState("");
  const [catId, setCatId] = useState<number | "">("");

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tRes, cRes] = await Promise.all([api.get("/transactions"), api.get("/categories")]);
      setTransactions(Array.isArray(tRes.data) ? tRes.data : []);
      setCategories(Array.isArray(cRes.data) ? cRes.data : []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setDesc("");
    setAmount("");
    setTxDate("");
    setCatId("");
    setIsModalOpen(true);
  };

  const openEditModal = (t: Transaction) => {
    setEditing(t);
    setDesc(t.description);
    setAmount(String(t.amount));
    setTxDate(formatDateForInput(t.transaction_date));
    setCatId(t.category_id || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!desc.trim() || !amount || !txDate || !catId) return;
    const payload = {
      description: desc.trim(),
      amount: parseFloat(amount),
      transaction_date: txDate,
      category_id: Number(catId),
    };
    try {
      if (editing) {
        await api.put(`/transactions/${editing.id}`, payload);
      } else {
        await api.post("/transactions", payload);
      }
      await fetchAll();
      closeModal();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((p) => p.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed");
    }
  };

  const handleFilter = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (filterCategory) params.category_id = filterCategory;
      const res = await api.get("/transactions/filtered", { params });
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Filter failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>💸 Transactions</h2>
        <div>
          <button className="btn-primary" onClick={openAddModal}>Add Transaction</button>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form className="filter-bar" onSubmit={handleFilter}>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value ? Number(e.target.value) : "")}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn-primary" type="submit">Filter</button>
        <button className="btn-secondary" type="button" onClick={fetchAll}>Reset</button>
      </form>

      {loading ? (
        <p>Loading transactions…</p>
      ) : (
        <div className="table-wrap">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount ($)</th>
                <th>Date</th>
                <th>Category</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.description}</td>
                  <td>{Number(t.amount).toFixed(2)}</td>
                  <td>{new Date(t.transaction_date).toLocaleDateString()}</td>
                  <td>{t.category}</td>
                  <td>
                    <button className="btn-ghost" onClick={() => openEditModal(t)}>✏️ Edit</button>
                    <button className="btn-danger small" onClick={() => handleDelete(t.id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Edit Transaction" : "Add Transaction"}
        footer={
          <>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>{editing ? "Update" : "Add"}</button>
          </>
        }
      >
        <form onSubmit={handleSave} className="form-stack">
          <label className="label">Description</label>
          <input className="auth-input" value={desc} onChange={(e) => setDesc(e.target.value)} />

          <label className="label">Amount</label>
          <input className="auth-input" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />

          <label className="label">Date</label>
          <input className="auth-input" type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} />

          <label className="label">Category</label>
          <select className="auth-input" value={catId} onChange={(e) => setCatId(e.target.value ? Number(e.target.value) : "")}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
