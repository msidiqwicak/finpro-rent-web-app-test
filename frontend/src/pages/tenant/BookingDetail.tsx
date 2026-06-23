import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import TenantLayout from "../../components/layout/TenantLayout"; // 👈 1. Import Layout Utama Kamu
import api from "../../api/axiosConfig";
import WaitingPayment from "../../components/tenant/booking/WaitingPayment";
import WaitingConfirmation from "../../components/tenant/booking/WaitingConfirmation";
import ConfirmedBooking from "../../components/tenant/booking/ConfirmedBooking";
import CanceledBooking from "../../components/tenant/booking/CanceledBooking";

export default function BookingDetailPage() {
  const { id } = useParams();
  const location = useLocation();

  const initialStatus = location.state?.status || "";
  const [bookingStatus, setBookingStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(!initialStatus);

  useEffect(() => {
    if (!initialStatus) {
      const fetchBookingDetail = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(`/tenant/bookings/${id}`);
          setBookingStatus(response.data.data.status);
        } catch (error) {
          console.error("Gagal mengambil detail booking:", error);
        } finally {
          setIsLoading(false);
        }
      };

      if (id) fetchBookingDetail();
    }
  }, [id, initialStatus]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">
            autorenew
          </span>
        </div>
      );
    }

    switch (bookingStatus) {
      case "WAITING_FOR_PAYMENT":
        return <WaitingPayment />;
      case "WAITING_FOR_CONFIRMATION":
        return <WaitingConfirmation />;
      case "CONFIRMED":
        return <ConfirmedBooking />;
      case "CANCELED":
        return <CanceledBooking />;
      default:
        return (
          <div className="text-center py-20 text-on-surface-variant">
            Status "{bookingStatus}" tidak dikenal atau API gagal memuat data.
          </div>
        );
    }
  };

  return (
    // 👈 2. Bungkus seluruh halaman menggunakan TenantLayout agar Sidebar & Navbar muncul otomatis
    <TenantLayout
      title="Detail Transaction"
      subtitle={`Manage the details data for order #${id?.substring(0, 8).toUpperCase()}`}
    >
      <div className="max-w-[1100px] mx-auto pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 text-on-surface-variant">
          <Link
            to="/tenant/bookings"
            className="font-label-md hover:text-primary transition-colors text-sm font-semibold"
          >
            Bookings
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="font-label-md text-primary font-bold text-sm">
            Order #{id?.substring(0, 8).toUpperCase()}
          </span>
        </nav>

        {/* Konten sub-status (WaitingPayment / WaitingConfirmation / Confirmed) akan merender di sini */}
        {renderContent()}
      </div>
    </TenantLayout>
  );
}
