import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
  // include credentials if backend uses cookies (optional)
  // withCredentials: true,
});

export default api;
