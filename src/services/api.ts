// service wrapper - uses src/api/client.ts axios instance
import client from "../api/client";

export function getToken() {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
}

export async function login(email: string, password: string) {
  const res = await client.post("/auth/login", { email, password });
  return res.data;
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await client.post("/auth/register", { username: name, email, password });
  return res.data;
}

export async function fetchTransactions(params?: Record<string, any>) {
  const res = await client.get("/transactions", { params });
  return res.data;
}

export async function fetchFilteredTransactions(params?: Record<string, any>) {
  const res = await client.get("/transactions/filtered", { params });
  return res.data;
}

export async function addTransaction(payload: any) {
  const res = await client.post("/transactions", payload);
  return res.data;
}

export async function updateTransaction(id: number, payload: any) {
  const res = await client.put(`/transactions/${id}`, payload);
  return res.data;
}

export async function deleteTransaction(id: number) {
  const res = await client.delete(`/transactions/${id}`);
  return res.data;
}

export async function fetchCategories() {
  const res = await client.get("/categories");
  return res.data;
}

export async function addCategory(payload: { name: string }) {
  const res = await client.post("/categories", payload);
  return res.data;
}

export async function updateCategory(id: number, payload: { name: string }) {
  const res = await client.put(`/categories/${id}`, payload);
  return res.data;
}

export async function deleteCategory(id: number) {
  const res = await client.delete(`/categories/${id}`);
  return res.data;
}

export async function summary(period: "weekly" | "monthly" = "monthly") {
  const res = await client.get("/transactions/summary", { params: { period } });
  return res.data;
}

export async function unusualTransactions(period = "monthly", multiplier = 2) {
  const res = await client.get("/transactions/unusual", { params: { period, multiplier } });
  return res.data;
}

export async function exportCsv() {
  const res = await client.get("/export/csv", { responseType: "blob" });
  return res.data;
}

export async function exportPdf() {
  const res = await client.get("/export/pdf", { responseType: "blob" });
  return res.data;
}
