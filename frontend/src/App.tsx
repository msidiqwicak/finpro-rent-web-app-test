import { BrowserRouter, Routes, Route } from "react-router-dom";

// ======== CONTEXT & PROTECTION ========
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// ======== PAGES ========
import LandingPage from "./pages/users/LandingPage";
import Checkout from "./pages/users/Checkout";
import Payment from "./pages/users/Payment";
import OrderHistory from "./pages/users/OrderHistory";
import LoginPage from "./pages/LoginPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import RegisterTenantPage from "./pages/RegisterTenantPage";
import VerifyPage         from "./pages/VerifyPage";
import ForgotPassword     from "./pages/ForgotPassword";
import ResetPassword      from "./pages/ResetPassword";

// ======== PLACEHOLDERS ========
const UserProfilePage = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    User Profile Page (Work in Progress)
  </div>
);

const TenantDashboardPage = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    Tenant Dashboard Page (Work in Progress)
  </div>
);

// ============================================================
// KOMPONEN APP (ROUTING UTAMA)
// ============================================================
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ======== RUTE PUBLIK ======== */}
          <Route path="/" element={<LandingPage />} />
          {/* ======== RUTE AUTH ======== */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterUserPage />} />
          <Route path="/tenant/register" element={<RegisterTenantPage />} />
          <Route path="/verify/:token"      element={<VerifyPage />} />
          <Route path="/verify-email-update/:token" element={<VerifyEmailUpdatePage />} />
          <Route path="/forgot-password"      element={<ForgotPassword />} />
          <Route path="/reset-password/:token"      element={<ResetPassword />} />
          {/* ======== RUTE TRANSAKSI & BOOKING ======== */}
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/bookings" element={<OrderHistory />} />
          <Route path="/order/:id" element={<OrderDetail />} />

          {/* ======== RUTE TERPROTEKSI: USER ======== */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          {/* ======== RUTE TERPROTEKSI: TENANT ======== */}
          <Route
            path="/tenant/dashboard"
            element={
              <ProtectedRoute requiredRole="TENANT">
                <TenantDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/bookings"
            element={
              <ProtectedRoute requiredRole="TENANT">
                <TenantTransaction />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
