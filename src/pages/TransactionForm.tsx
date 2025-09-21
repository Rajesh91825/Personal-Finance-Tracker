// src/pages/TransactionForm.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Transaction, Category } from "../types";
import api from "../api/client";
import { useNavigate, useParams } from "react-router-dom";

const TransactionForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const { register, handleSubmit, reset } = useForm<Transaction>();
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const res = await api.get("/transactions");
          const tx = res.data.find((t: Transaction) => String(t.id) === String(id));
          if (tx) reset(tx);
        } catch {
          // ignore
        }
      })();
    } else {
      reset({ amount: "", description: "", transaction_date: new Date().toISOString().slice(0, 10) });
    }
  }, [id]);

  const onSubmit = async (data: Transaction) => {
    try {
      if (isEdit) {
        await api.put(`/transactions/${id}`, data);
        alert("Updated");
      } else {
        await api.post("/transactions", data);
        alert("Added");
      }
      navigate("/transactions");
    } catch (err) {
      alert("Save failed");
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h1 className="text-xl mb-4">{isEdit ? "Edit Transaction" : "Add Transaction"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Amount</label>
          <input {...register("amount", { required: true })} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Description</label>
          <input {...register("description", { required: true })} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Date</label>
          <input type="date" {...register("transaction_date", { required: true })} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Category</label>
          <select {...register("category_id")} className="w-full border px-3 py-2 rounded">
            <option value="">Select</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">{isEdit ? "Update" : "Create"}</button>
          <button type="button" onClick={() => navigate("/transactions")} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
