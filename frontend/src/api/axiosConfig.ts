import axios from "axios";

// Membuat "instance" Axios khusus untuk proyek ini
const api = axios.create({
  baseURL: "http://localhost:8000/api", // URL dasar backend kamu
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Otomatis menyisipkan token JWT di setiap request
api.interceptors.request.use((config) => {
  // 1. Ambil STRING dari local storage
  const authUserString = localStorage.getItem("auth_user");

  if (authUserString) {
    try {
      // 2. Ubah string menjadi object JavaScript
      const authUser = JSON.parse(authUserString);

      // 3. Ambil token dari DALAM object tersebut
      const token = authUser.token;

      // 4. Suntikkan token ke headers
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Gagal parsing data auth_user:", error);
    }
  }
  return config;
});

export default api;
