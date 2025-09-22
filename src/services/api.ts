// src/services/api.ts
import client from "../api/client";

// keep default export (so pages can still do `api.get(...)`)
export default client;

// also export helper wrappers if you want cleaner usage elsewhere
export const getDashboard = () => client.get("/transactions/summary?period=monthly");
export const getTransactions = () => client.get("/transactions");
export const getCategories = () => client.get("/categories");
export const createTransaction = (data: any) => client.post("/transactions", data);
export const updateTransaction = (id: number, data: any) =>
  client.put(`/transactions/${id}`, data);
export const deleteTransaction = (id: number) => client.delete(`/transactions/${id}`);
export const createCategory = (data: any) => client.post("/categories", data);
export const updateCategory = (id: number, data: any) =>
  client.put(`/categories/${id}`, data);
export const deleteCategory = (id: number) => client.delete(`/categories/${id}`);
export const getUnusualTransactions = (multiplier: number) =>
  client.get(`/transactions/unusual?multiplier=${multiplier}`);
export const exportCsv = () =>
  client.get("/export/csv", { responseType: "blob" });
export const exportPdf = () =>
  client.get("/export/pdf", { responseType: "blob" });
