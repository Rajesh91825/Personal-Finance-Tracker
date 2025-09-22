import React, { useEffect, useState } from "react";
import { fetchCategories, addCategory, updateCategory, deleteCategory } from "../services/api";
import Modal from "../components/Modal";
import toast from "react-hot-toast";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [name, setName] = useState("");

  useEffect(()=>{ load(); }, []);

  async function load() {
    try {
      const c = await fetchCategories();
      setCategories(c);
    } catch {}
  }

  function openAdd() {
    setEditing(null);
    setName("");
    setShowModal(true);
  }

  function openEdit(cat: any) {
    setEditing(cat);
    setName(cat.name);
    setShowModal(true);
  }

  async function submit() {
    if (!name) return toast.error("Enter name");
    try {
      if (editing) {
        await updateCategory(editing.id, { name });
        toast.success("Category updated ✅");
      } else {
        await addCategory({ name });
        toast.success("Category added ✅");
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete category? This will cascade if allowed.")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted ✅");
      load();
    } catch (err:any) {
      toast.error(err?.response?.data?.message || "Error");
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">📁 Categories</h1>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button className="btn primary" onClick={openAdd}>+ Add Category</button>
      </div>

      <div className="card categories-card">
        {categories.map((c)=>(
          <div className="category-pill" key={c.id}>
            <div className="cat-name">{c.name}</div>
            <div className="cat-actions">
              <button className="btn outline small" onClick={()=>openEdit(c)}>Edit</button>
              <button className="btn danger small" onClick={()=>handleDelete(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          open={showModal}   // ✅ pass it here
          title={editing ? "Edit Category" : "Add Category"}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn primary" onClick={submit}>Save</button>
            </>
          }
        >
          <input
            placeholder="Category name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </Modal>

      )}
    </div>
  );
}
