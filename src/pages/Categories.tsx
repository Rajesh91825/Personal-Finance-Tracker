// src/pages/Categories.tsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import { toast } from "react-hot-toast";

type Category = { id: number; name: string };

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");

  async function fetchAll() {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  }
  useEffect(() => { fetchAll(); }, []);

  function openAdd() { setEditing(null); setName(""); setOpen(true); }
  function openEdit(c: Category) { setEditing(c); setName(c.name); setOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, { name });
        toast.success("Category updated ✅");
      } else {
        await api.post("/categories", { name });
        toast.success("Category added ✅");
      }
      setOpen(false);
      fetchAll();
    } catch {
      toast.error("Failed to save category");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete category and cascade delete transactions?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted ✅");
      fetchAll();
    } catch {
      toast.error("Failed to delete category");
    }
  }

  return (
    <div className="container">
      <div className="page-title"><span>📁</span><div>Categories</div></div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="text-muted">Organize your transactions</div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Category</button>
        </div>

        <div className="mt-2">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            {categories.map(c => (
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, padding: "10px 16px", background:"#fff", borderRadius: 10, boxShadow: "0 6px 20px rgba(14,20,30,0.06)" }}>
                <div style={{ fontWeight:700 }}>{c.name}</div>
                <div style={{ marginLeft: 8 }}>
                  <button className="btn btn-ghost" onClick={() => openEdit(c)} style={{ marginRight: 8 }}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editing ? "Edit Category" : "Add Category"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" required />
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

export default Categories;
