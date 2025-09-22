import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../services/api";
import Modal from "../components/Modal";
import Confirm from "../components/Confirm";
import "../styles.css";

type Category = {
  id: number;
  name: string;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);

  const load = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, { name });
        toast.success("Category updated");
      } else {
        await api.post("/categories", { name });
        toast.success("Category added");
      }
      setShowModal(false);
      setEditing(null);
      setName("");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save category");
    }
  };

  const remove = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="page">
      <h2>📂 Categories</h2>
      <div className="categories-list">
        {categories.map((c) => (
          <div key={c.id} className="chip">
            {c.name}
            <button
              className="btn small"
              onClick={() => {
                setEditing(c);
                setName(c.name);
                setShowModal(true);
              }}
            >
              Edit
            </button>
            <button
              className="btn danger small"
              onClick={() => setConfirmDelete(c)}
            >
              Delete
            </button>
          </div>
        ))}
        <button className="btn primary" onClick={() => setShowModal(true)}>
          + Add
        </button>
      </div>

      {showModal && (
        <Modal
          open={showModal}
          title={editing ? "Edit Category" : "Add Category"}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
            setName("");
          }}
          footer={
            <>
              <button
                className="btn outline"
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  setName("");
                }}
              >
                Cancel
              </button>
              <button className="btn primary" onClick={submit}>
                Save
              </button>
            </>
          }
        >
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Modal>
      )}

      {confirmDelete && (
        <Confirm
          open={!!confirmDelete}
          title="Delete Category"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => remove(confirmDelete.id)}
        >
          Are you sure you want to delete {confirmDelete.name}?
        </Confirm>
      )}
    </div>
  );
}
