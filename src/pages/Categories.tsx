import React, { useEffect, useState } from "react";
import api from "../api/client";

interface Category {
  id: string;
  name: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const handleAdd = async () => {
    if (!newCategory) return;
    await api.post("/categories", { name: newCategory });
    setNewCategory("");
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = async (id: string) => {
    if (!editName) return;
    await api.put(`/categories/${id}`, { name: editName });
    setEditingId(null);
    setEditName("");
    fetchCategories();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">📂 Categories</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="p-2 border rounded w-64"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-2">
                {editingId === c.id ? (
                  <input
                    className="p-1 border rounded"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  c.name
                )}
              </td>
              <td className="p-2 flex gap-2">
                {editingId === c.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(c.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(c)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesPage;
