// src/api/client.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // store your JWT here after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
