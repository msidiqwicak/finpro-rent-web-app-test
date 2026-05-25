import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ======== CONTEXT & PROTECTION ========
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// ======== PAGES ========
import LandingPage from "./pages/LandingPage";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderHistory from "./pages/OrderHistory";
import LoginPage from "./pages/LoginPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import RegisterTenantPage from "./pages/RegisterTenantPage";
import VerifyPage from "./pages/VerifyPage";

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
          <Route path="/verify/:token" element={<VerifyPage />} />

          {/* ======== RUTE TRANSAKSI & BOOKING ======== */}
          {/* Catatan: Kalau halaman ini butuh login, kamu bisa bungkus 
              dengan <ProtectedRoute> seperti pada rute /profile */}
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/bookings" element={<OrderHistory />} />

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
