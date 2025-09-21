import React, { useEffect, useState } from "react";
import api from "../api/client";
import "../styles.css";

interface Category {
  id: string;
  name: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      const res = await api.post("/categories", { name: newCat });
      setCategories((prev) => [...prev, res.data]);
      setNewCat("");
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  return (
    <div className="page">
      <h2>📂 Categories</h2>
      <form onSubmit={addCategory} className="form-inline">
        <input
          className="auth-input"
          placeholder="New category"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <button className="btn-primary" type="submit">Add</button>
      </form>
      <ul className="list">
        {categories.map((c) => (
          <li key={c.id} className="list-item">
            {c.name}
            <button className="btn-danger small" onClick={() => deleteCategory(c.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
