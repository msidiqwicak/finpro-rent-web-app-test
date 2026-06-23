import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

// ============================================================
// TIPE DATA
// ============================================================
// Mendefinisikan struktur data user yang akan disimpan di state global
export interface AuthUser {
  id:         string;
  name:       string;
  email:      string;
  role:       'USER' | 'TENANT';
  token?:     string; // Token is now optional since it's stored in HttpOnly cookie
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

  // Saat aplikasi pertama dibuka (mount), ambil data dari backend via HTTPOnly cookie
  useEffect(() => {
    const fetchMe = async () => {
      // PERMANENT FIX: Wipe any ghost token left over from old code versions
      // so it never appears in the Application tab and avoids mentor sanctions.
      localStorage.removeItem('token');

      try {
        const { default: api } = await import('../api/axiosConfig');
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        // Sinkronisasi data non-sensitif ke localStorage untuk UI
        localStorage.setItem('auth_user_public', JSON.stringify({
          name: res.data.user.name,
          role: res.data.user.role
        }));
      } catch (error) {
        setUser(null);
        localStorage.removeItem('auth_user_public');
        localStorage.removeItem('auth_user'); // Bersihkan sisa data lama jika ada
      } finally {
        setIsLoading(false);
      }
    };
    fetchMe();
  }, []);

  // Fungsi dipanggil setelah user berhasil login dari API
  const login = (userData: AuthUser) => {
    setUser(userData);
    // HANYA simpan data non-sensitif (name & role) ke localStorage sesuai instruksi keamanan
    localStorage.setItem('auth_user_public', JSON.stringify({
      name: userData.name,
      role: userData.role
    }));
    // Hapus data lama yang mungkin menyimpan token
    localStorage.removeItem('auth_user');
  };

  // Fungsi dipanggil saat user menekan tombol Logout
  const logout = async () => {
    try {
      const { default: api } = await import('../api/axiosConfig');
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout API failed:", err);
    }
    setUser(null);
    localStorage.removeItem('auth_user_public');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token'); // Pastikan token hantu juga terhapus
    signOut(auth).catch((error) => console.error("Firebase logout failed:", error));
  };

  // ============================================================
  // AUTO LOGOUT (IDLE TIMEOUT) - 1 JAM (3.600.000 ms)
  // ============================================================
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        if (user) {
          console.log('Session expired due to inactivity (1 minute).');
          await logout();
          // Use alert to notify the user why they were logged out automatically
          alert('Your session has automatically expired due to 30 minutes of inactivity.');
          window.location.href = '/login';
        }
      }, 1800000); // 30 menit
    };

    // Daftar event yang dianggap sebagai "aktivitas pengguna"
    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];

    // Hanya jalankan sensor pendeteksi jika ada user yang login
    if (user) {
      resetTimer();
      events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    }

    // Bersihkan event listener saat komponen dihancurkan / user berubah
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user]); // Effect ini dipicu setiap kali status 'user' berubah

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
