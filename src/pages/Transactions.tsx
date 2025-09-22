import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import Modal from "../components/Modal";
import Confirm from "../components/Confirm";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";
import "../styles.css";

interface Category {
  id: number;
  name: string;
  type?: "income" | "expense";
}

interface Transaction {
  id: number;
  user_id?: number;
  category_id: number;
  amount: number;
  description: string;
  transaction_date: string;
}

const rupee = (n: number) =>
  "₹ " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | "">("");

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [txDate, setTxDate] = useState("");
  const [catId, setCatId] = useState<number | "">("");

  // delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tRes, cRes] = await Promise.all([api.get("/transactions"), api.get("/categories")]);
      setTransactions(Array.isArray(tRes.data) ? tRes.data.sort((a:any,b:any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()) : []);
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
    setTxDate(t.transaction_date);
    setCatId(t.category_id || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!desc || !amount || !txDate || !catId) {
      toast.error("Please fill all fields");
      return;
    }
    const payload = {
      description: desc.trim(),
      amount: parseFloat(String(amount)),
      transaction_date: txDate,
      category_id: Number(catId),
    };
    try {
      if (editing) {
        const res = await api.put(`/transactions/${editing.id}`, payload);
        toast.success(res.data?.message || "Updated");
      } else {
        const res = await api.post("/transactions", payload);
        toast.success(res.data?.message || "Added");
      }
      await fetchAll();
      closeModal();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Save failed");
    }
  };

  const handleDeleteClick = (id: number) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      const res = await api.delete(`/transactions/${toDeleteId}`);
      toast.success(res.data?.message || "Deleted");
      setTransactions((p) => p.filter((x) => x.id !== toDeleteId));
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setConfirmOpen(false);
      setToDeleteId(null);
    }
  };

  const handleFilter = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (filterCategory) params.category_id = filterCategory;
      const res = await api.get("/transactions/filtered", { params });
      setTransactions(Array.isArray(res.data) ? res.data.sort((a:any,b:any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()) : []);
      setPage(1);
    } catch (err: any) {
      console.error(err);
      toast.error("Filter failed");
    } finally {
      setLoading(false);
    }
  };

  // pagination slices
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return transactions.slice(start, start + pageSize);
  }, [transactions, page]);

  return (
    <div className="page">
      <div className="page-header">
        <h2>💸 Transactions</h2>
        <div>
          <button className="btn-primary" onClick={openAddModal}>Add Transaction</button>
        </div>
      </div>

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

      {loading ? <p>Loading…</p> : (
        <>
          <div className="table-wrap">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th style={{ width: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => (
                  <tr key={t.id}>
                    <td>{t.description}</td>
                    <td>{rupee(Number(t.amount))}</td>
                    <td>{new Date(t.transaction_date).toLocaleDateString()}</td>
                    <td>{categories.find((c) => c.id === t.category_id)?.name || "Others"}</td>
                    <td>
                      <button className="btn-ghost" onClick={() => openEditModal(t)}>✏️ Edit</button>
                      <button className="btn-danger small" onClick={() => handleDeleteClick(t.id)}>🗑 Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination total={transactions.length} page={page} pageSize={pageSize} onPageChange={(p) => setPage(p)} />
        </>
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
        <form className="form-stack" onSubmit={handleSave}>
          <label className="label">Description</label>
          <input className="auth-input" value={desc} onChange={(e) => setDesc(e.target.value)} autoFocus />

          <label className="label">Amount</label>
          <input className="auth-input" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />

          <label className="label">Date</label>
          <input className="auth-input" type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} />

          <label className="label">Category</label>
          <select className="auth-input" value={catId} onChange={(e) => setCatId(e.target.value ? Number(e.target.value) : "")}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name} {c.type ? `(${c.type})` : ""}</option>)}
          </select>
        </form>
      </Modal>

      <Confirm
        open={confirmOpen}
        title="Delete transaction"
        message="This will permanently remove the transaction. Are you sure?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Transactions;
