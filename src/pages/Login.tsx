// src/pages/Login.tsx
import React from "react";
import { useForm } from "react-hook-form";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type FormData = { email: string; password: string };

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { email: "", password: "" } });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post("/auth/login", data);
      const token = res.data?.token;
      if (!token) throw new Error("No token returned");
      login(token);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input {...register("email", { required: true })} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" {...register("password", { required: true })} className="w-full border px-3 py-2 rounded" />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
