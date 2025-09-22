import React, { useEffect, useState } from "react";
import api from "../api/client";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data || []);
  };

  const handleSubmit = async () => {
    if (!name) return;

    if (editingId) {
      await api.put(`/categories/${editingId}`, { name, type });
    } else {
      await api.post("/categories", { name, type });
    }

    setName("");
    setType("expense");
    setEditingId(null);
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setType(cat.type);
    setEditingId(cat.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">📂 Categories</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="p-2 border rounded w-60"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setName("");
              setType("expense");
              setEditingId(null);
            }}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        )}
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{c.name}</td>
              <td className="p-2 capitalize">{c.type}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesPage;
