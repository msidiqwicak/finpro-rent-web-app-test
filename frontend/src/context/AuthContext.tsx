import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ============================================================
// TIPE DATA
// ============================================================
// Mendefinisikan struktur data user yang akan disimpan di state global
export interface AuthUser {
  id:         string;
  name:       string;
  email:      string;
  role:       'USER' | 'TENANT';
  token:      string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;           // Data user yang login, null jika belum login
  isLoading: boolean;              // True saat sedang mengecek status login dari localStorage
  login: (userData: AuthUser) => void;  // Fungsi untuk menyimpan data login
  logout: () => void;              // Fungsi untuk menghapus data login
}

// ============================================================
// MEMBUAT CONTEXT
// ============================================================
// Context adalah "wadah global" yang bisa diakses oleh semua komponen
// tanpa perlu meneruskan props secara manual (prop drilling)
const AuthContext = createContext<AuthContextType | null>(null);

// ============================================================
// PROVIDER
// ============================================================
// Provider adalah komponen pembungkus yang menyediakan nilai context
// ke semua komponen di dalamnya (children)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Saat aplikasi pertama dibuka (mount), cek apakah ada data login
  // yang tersimpan di localStorage browser (sesi sebelumnya)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Jika data di localStorage corrupt, hapus saja
      localStorage.removeItem('auth_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fungsi dipanggil setelah user berhasil login dari API
  const login = (userData: AuthUser) => {
    setUser(userData);
    // Simpan ke localStorage agar sesi tidak hilang saat halaman di-refresh
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  // Fungsi dipanggil saat user menekan tombol Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// CUSTOM HOOK
// ============================================================
// Hook ini mempermudah komponen lain untuk mengakses AuthContext
// Cukup tulis: const { user, login, logout } = useAuth();
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
