import axios from "axios";

// Membuat "instance" Axios khusus untuk proyek ini
const api = axios.create({
  baseURL: "http://localhost:8000/api", // URL dasar backend kamu
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
