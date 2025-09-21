import React, { useEffect, useState } from "react";
import api from "../api/client";
import Modal from "../components/Modal";
import "../styles.css";

interface Category {
  id: number;
  name: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [nameInput, setNameInput] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setNameInput("");
    setIsModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setNameInput(c.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setNameInput("");
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!nameInput.trim()) return;
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, { name: nameInput.trim() });
      } else {
        await api.post("/categories", { name: nameInput.trim() });
      }
      await fetchCategories();
      closeModal();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((p) => p.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>📂 Categories</h2>
        <button className="btn-primary" onClick={openAdd}>Add Category</button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div style={{ marginTop: 12 }}>
        {loading ? (
          <p>Loading categories…</p>
        ) : (
          <div className="category-grid">
            {categories.map((c) => (
              <div key={c.id} className="category-card">
                <div className="category-name">{c.name}</div>
                <div className="category-actions">
                  <button className="btn-ghost" onClick={() => openEdit(c)} title="Edit">✏️</button>
                  <button className="btn-danger small" onClick={() => handleDelete(c.id)} title="Delete">🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Edit Category" : "Add Category"}
        footer={
          <>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>{editing ? "Save" : "Add"}</button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <label className="label">Name</label>
          <input className="auth-input" value={nameInput} onChange={(e) => setNameInput(e.target.value)} autoFocus />
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
