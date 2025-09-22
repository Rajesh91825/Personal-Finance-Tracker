import React, { useEffect, useState } from "react";
import {
  fetchTransactions,
  fetchCategories,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  fetchFilteredTransactions,
} from "../services/api";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { rupee, dateOnly } from "../utils/format";

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  // form state
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [catId, setCatId] = useState<number | "">("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const tx = await fetchTransactions();
      setTransactions(tx);
      const c = await fetchCategories();
      setCategories(c);
    } catch (err) {}
  }

  function openAdd() {
    setEditing(null);
    setDesc("");
    setAmount("");
    setDate("");
    setCatId("");
    setShowModal(true);
  }

  function openEdit(tx: any) {
    setEditing(tx);
    setDesc(tx.description);
    setAmount(String(tx.amount));
    setDate(dateOnly(tx.transaction_date));
    setCatId(tx.category_id || "");
    setShowModal(true);
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!desc || !amount || !date || !catId) return toast.error("Please fill all fields");
    try {
      if (editing) {
        await updateTransaction(editing.id, { amount: Number(amount), description: desc, transaction_date: date, category_id: catId });
        toast.success("Transaction updated ✅");
      } else {
        await addTransaction({ amount: Number(amount), description: desc, transaction_date: date, category_id: catId });
        toast.success("Transaction added ✅");
      }
      setShowModal(false);
      loadAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete transaction?")) return;
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted ✅");
      loadAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error");
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">💸 Transactions</h1>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button className="btn primary" onClick={openAdd}>+ Add Transaction</button>
      </div>

      <div className="card">
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
                <td>{dateOnly(t.transaction_date)}</td>
                <td>{t.category}</td>
                <td>
                  <button className="btn outline small" onClick={() => openEdit(t)}>Edit</button>{" "}
                  <button className="btn danger small" onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        // <Modal title={editing ? "Edit Transaction" : "Add Transaction"} onClose={() => setShowModal(false)} footer={
        //   <>
        //     <button className="btn outline" onClick={() => setShowModal(false)}>Cancel</button>
        //     <button className="btn primary" onClick={() => handleSubmit()}>Save</button>
        //   </>
        // }>
        //   <form onSubmit={(e)=>{ e.preventDefault(); handleSubmit(); }}>
        //     <input placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} />
        //     <input placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
        //     <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
        //     <select value={catId} onChange={(e)=>setCatId(Number(e.target.value))}>
        //       <option value="">Select category</option>
        //       {categories.map((c)=> <option key={c.id} value={c.id}>{c.name}</option>)}
        //     </select>
        //   </form>
        // </Modal>
        <Modal
          open={showModal}   // ✅ pass it here
          title={editing ? "Edit Transaction" : "Add Transaction"}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn primary" onClick={() => handleSubmit()}>Save</button>
            </>
          }
        >
          <form onSubmit={(e)=>{ e.preventDefault(); handleSubmit(); }}>
            <input placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} />
            <input placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
            <select value={catId} onChange={(e)=>setCatId(Number(e.target.value))}>
              <option value="">Select category</option>
              {categories.map((c)=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </form>
        </Modal>

      )}
    </div>
  );
}
