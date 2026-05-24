import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// ======== HALAMAN PUBLIK ========
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterUserPage from './pages/RegisterUserPage';
import RegisterTenantPage from './pages/RegisterTenantPage';
import VerifyPage from './pages/VerifyPage';

// ======== HALAMAN PLACEHOLDER (belum dibuat penuh) ========
// Nanti ganti komponen placeholder ini dengan komponen halaman aslinya.
const UserProfilePage = () => <div style={{padding:'2rem', textAlign:'center'}}>User Profile Page (Work in Progress)</div>;
const TenantDashboardPage = () => <div style={{padding:'2rem', textAlign:'center'}}>Tenant Dashboard Page (Work in Progress)</div>;

// ============================================================
// KOMPONEN APP (ROUTING UTAMA)
// ============================================================
function App() {
  return (
    // AuthProvider HARUS membungkus BrowserRouter dan seluruh rute
    // agar useAuth() bisa diakses dari semua halaman dan komponen
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ======== RUTE PUBLIK ======== */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth: Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Auth: Registrasi User biasa */}
          <Route path="/register" element={<RegisterUserPage />} />

          {/* Auth: Registrasi Tenant */}
          <Route path="/tenant/register" element={<RegisterTenantPage />} />

          {/* Auth: Verifikasi email & set password (token dari URL) */}
          <Route path="/verify/:token" element={<VerifyPage />} />

          {/* ======== RUTE TERPROTEKSI: USER ======== */}
          {/* Hanya bisa diakses oleh user yang sudah login dengan role 'USER' */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ======== RUTE TERPROTEKSI: TENANT ======== */}
          {/* Hanya bisa diakses oleh user yang sudah login dengan role 'TENANT' */}
          <Route
            path="/tenant/dashboard"
            element={
              <ProtectedRoute requiredRole="TENANT">
                <TenantDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

