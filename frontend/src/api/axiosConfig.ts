import axios from "axios";

// Membuat "instance" Axios khusus untuk proyek ini
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api", // URL dasar backend kamu
  withCredentials: true, // WAJIB agar cookie terkirim otomatis
});

export default api;
