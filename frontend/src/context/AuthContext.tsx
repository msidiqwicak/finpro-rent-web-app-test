import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import api from '../api/axiosConfig';

// ============================================================
// TIPE DATA
// ============================================================
export interface AuthUser {
  id:          string;
  name:        string;
  email:       string;
  role:        'USER' | 'TENANT';
  token?:      string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user:      AuthUser | null;
  isLoading: boolean;
  login:     (userData: AuthUser) => void;
  logout:    () => void;
}

// ============================================================
// MEMBUAT CONTEXT
// ============================================================
const AuthContext = createContext<AuthContextType | null>(null);

// ============================================================
// PROVIDER
// ============================================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]           = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ----- Fungsi Login & Logout (stable reference) -----------
  const login = useCallback((userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('auth_user_public', JSON.stringify({
      name: userData.name,
      role: userData.role
    }));
    localStorage.removeItem('auth_user');
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API failed:', err);
    }
    setUser(null);
    localStorage.removeItem('auth_user_public');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('social_login_intent');
    signOut(auth).catch((error) => console.error('Firebase logout failed:', error));
  }, []);

  // ============================================================
  // STEP 1 — onAuthStateChanged (Hanya untuk Social Login baru)
  // ============================================================
  // Observer ini dipanggil Firebase setiap kali status auth berubah.
  // KUNCI: Kita gunakan flag 'social_login_intent' di sessionStorage untuk
  // membedakan antara "login baru" dan "refresh halaman biasa".
  // Jika flag ADA  → ini login baru → panggil /social-login ke backend.
  // Jika flag TIDAK ADA → ini refresh halaman → ABAIKAN, biarkan /auth/me yang menangani (Step 2).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const intentStr = sessionStorage.getItem('social_login_intent');

      // Bukan login baru (hanya refresh halaman), langsung skip.
      if (!intentStr) return;

      if (firebaseUser) {
        try {
          const { provider, action, requestedRole } = JSON.parse(intentStr);

          // Dapatkan ID Token terbaru dari Firebase
          const idToken = await firebaseUser.getIdToken();

          // Kirim ke backend HANYA SEKALI untuk verifikasi & membuat sesi (cookie)
          const res = await api.post('/auth/social-login', {
            idToken,
            provider,
            action,
            requestedRole,
          });

          const data = res.data.data ?? res.data;
          // Update state global dengan data user dari DATABASE kita sendiri
          login({ ...data.user });

        } catch (err: any) {
          // Simpan error agar bisa ditampilkan oleh komponen SocialLogin
          const message = err.response?.data?.error ?? err.message ?? 'Social login failed.';
          sessionStorage.setItem('social_login_error', message);
          // Sign out dari Firebase jika backend gagal memvalidasi
          await signOut(auth);
        } finally {
          // Hapus flag intent apapun hasilnya, agar tidak dipanggil lagi saat refresh
          sessionStorage.removeItem('social_login_intent');
        }
      } else {
        // Firebase tidak mengembalikan user (misal popup ditutup)
        sessionStorage.removeItem('social_login_intent');
      }
    });

    // Bersihkan listener saat komponen di-unmount
    return () => unsubscribe();
  }, [login]);

  // ============================================================
  // STEP 2 — Cek sesi via Cookie /auth/me (saat refresh halaman)
  // ============================================================
  // Dipanggil HANYA SEKALI saat aplikasi pertama dibuka.
  // Mengandalkan HTTP-Only cookie yang sudah disimpan oleh backend.
  useEffect(() => {
    const fetchMe = async () => {
      // Bersihkan sisa token lama yang mungkin masih ada
      localStorage.removeItem('token');

      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        localStorage.setItem('auth_user_public', JSON.stringify({
          name: res.data.user.name,
          role: res.data.user.role,
        }));
      } catch {
        setUser(null);
        localStorage.removeItem('auth_user_public');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMe();
  }, []);

  // ============================================================
  // AUTO LOGOUT (IDLE TIMEOUT) - 30 MENIT
  // ============================================================
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        if (user) {
          console.log('Session expired due to inactivity.');
          await logout();
          alert('Your session has automatically expired due to 30 minutes of inactivity.');
          window.location.href = '/login';
        }
      }, 1800000); // 30 menit
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];

    if (user) {
      resetTimer();
      events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    }

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// CUSTOM HOOK
// ============================================================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
