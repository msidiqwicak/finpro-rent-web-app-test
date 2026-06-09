import { BrowserRouter, Routes, Route } from "react-router-dom";

// ======== CONTEXT & PROTECTION ========
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// ======== PAGES ========
import LandingPage from "./pages/users/LandingPage";
import ExplorePage from "./pages/users/ExplorePage";
import PropertyDetailPage from "./pages/users/PropertyDetailPage";
import Checkout from "./pages/users/Checkout";
import Payment from "./pages/users/Payment";
import OrderHistory from "./pages/users/Booking";
import LoginPage from "./pages/LoginPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import RegisterTenantPage from "./pages/RegisterTenantPage";
import VerifyPage from "./components/auth/VerifyPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OrderDetail from "./pages/users/BookingDetail";
import VerifyEmailUpdatePage from "./components/profile/VerifyEmailUpdatePage";
import VerifyPassword from "./pages/VerifyPassword";
import VerifyEmail from "./pages/VerifyEmail";
import TenantTransaction from "./pages/tenant/Booking";
import TenantDashboardPage from "./pages/tenant/Dashboard";
import PropertyListPage from "./pages/tenant/PropertyListPage";
import CreatePropertyPage from "./pages/tenant/CreatePropertyPage";
import ManageRoomsPage from "./pages/tenant/ManageRoomsPage";
import UserProfilePage from "./pages/users/UserProfilePage";
import TenantBookingDetail from "./pages/tenant/BookingDetail";

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
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />

          {/* ======== RUTE AUTH ======== */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterUserPage />} />
          <Route path="/tenant/register" element={<RegisterTenantPage />} />
          <Route path="/verify/:token" element={<VerifyPage />} />
          <Route
            path="/verify-email-update/:token"
            element={<VerifyEmailUpdatePage />}
          />
          <Route path="/verify" element={<VerifyPassword />} />
          <Route path="/verify-email-update" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ======== RUTE TERPROTEKSI: USER ======== */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ======== RUTE TRANSAKSI & BOOKING ======== */}
          <Route
            path="/checkout/:id"
            element={
              <ProtectedRoute requiredRole="USER">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute requiredRole="USER">
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute requiredRole="USER">
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute requiredRole="USER">
                <OrderDetail />
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
          <Route
            path="/tenant/properties"
            element={
              <ProtectedRoute requiredRole="TENANT">
                <PropertyListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/properties/create"
            element={
              <ProtectedRoute requiredRole="TENANT">
                <CreatePropertyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/properties/:id/rooms"
            element={
              <ProtectedRoute requiredRole="TENANT">
                <ManageRoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/bookings/:id"
            element={
              <ProtectedRoute requiredRole="TENANT">
                <TenantBookingDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
