import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",   
  timeout: 30000,
});

// Auto-attach JWT token to protected requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;