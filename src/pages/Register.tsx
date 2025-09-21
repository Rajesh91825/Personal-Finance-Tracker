// src/pages/Register.tsx
import React from "react";
import { useForm } from "react-hook-form";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

type FormData = { username: string; email: string; password: string };

const RegisterPage: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/auth/register", data);
      alert("Registered — please login");
      navigate("/login");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Username</label>
          <input {...register("username", { required: true })} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input {...register("email", { required: true })} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" {...register("password", { required: true })} className="w-full border px-3 py-2 rounded" />
        </div>
        <button className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
