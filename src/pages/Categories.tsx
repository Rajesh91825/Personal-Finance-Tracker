// src/pages/Categories.tsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import { Category } from "../types";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      alert("Failed to load");
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newName.trim()) return alert("Enter a name");
    try {
      await api.post("/categories", { name: newName });
      setNewName("");
      load();
    } catch {
      alert("Add failed");
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Categories</h1>

      <div className="bg-white p-4 mb-4 rounded shadow">
        <div className="flex gap-2">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New category" className="border px-3 py-2 rounded flex-1" />
          <button onClick={add} className="px-3 py-2 bg-green-600 text-white rounded">Add</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <ul>
          {categories.map(c => (
            <li key={c.id} className="flex justify-between py-2 border-b">
              <span>{c.name}</span>
              <button onClick={() => remove(c.id)} className="text-red-600">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesPage;
