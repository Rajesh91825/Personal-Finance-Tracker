import React, { useEffect, useState } from "react";
import api from "../api/client";
import Modal from "../components/Modal";
import Confirm from "../components/Confirm";
import toast from "react-hot-toast";
import "../styles.css";

interface Category {
  id: number;
  name: string;
  type?: "income" | "expense";
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setType("expense");
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setName(c.name);
    setType(c.type || "expense");
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, { name: name.trim(), type });
        toast.success("Category updated");
      } else {
        await api.post("/categories", { name: name.trim(), type });
        toast.success("Category added");
      }
      await fetch();
      close();
    } catch (err: any) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  const confirmDelete = (id: number) => {
    setToDelete(id);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`/categories/${toDelete}`);
      toast.success("Category deleted (and cascade applied)");
      setCategories((p) => p.filter((c) => c.id !== toDelete));
    } catch (err: any) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setConfirmOpen(false);
      setToDelete(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>📂 Categories</h2>
        <div><button className="btn-primary" onClick={openAdd}>Add Category</button></div>
      </div>

      {loading ? <p>Loading…</p> : (
        <div className="category-grid" style={{ marginTop: 12 }}>
          {categories.map((c) => (
            <div key={c.id} className="category-card">
              <div>
                <div className="category-name">{c.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{c.type ? c.type.toUpperCase() : "EXPENSE"}</div>
              </div>
              <div className="category-actions">
                <button className="btn-ghost" onClick={() => openEdit(c)}>✏️</button>
                <button className="btn-danger small" onClick={() => confirmDelete(c.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={open}
        onClose={close}
        title={editing ? "Edit Category" : "Add Category"}
        footer={
          <>
            <button className="btn-secondary" onClick={close}>Cancel</button>
            <button className="btn-primary" onClick={save}>{editing ? "Save" : "Add"}</button>
          </>
        }
      >
        <form className="form-stack" onSubmit={save}>
          <label className="label">Name</label>
          <input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <label className="label">Type</label>
          <select className="auth-input" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </form>
      </Modal>

      <Confirm
        open={confirmOpen}
        title="Delete category"
        message="Deleting this category will also remove or cascade associated transactions. Continue?"
        onConfirm={doDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Categories;
