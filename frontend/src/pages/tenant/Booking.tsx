import { useState, useEffect } from "react";
import TenantLayout from "../../components/layout/TenantLayout";
import api from "../../api/axiosConfig";
import BookingFilterBar from "../../components/tenant/booking/BookingFilterBar";
import BookingTable from "../../components/tenant/booking/BookingTable";
import ConfirmPaymentModal from "../../components/tenant/booking/ConfirmPaymentModal";
import CancelBookingModal from "../../components/tenant/booking/CancelBookingModal";

const FILTER_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Waiting For Payment", value: "WAITING_FOR_PAYMENT" },
  { label: "Waiting For Confirmation", value: "WAITING_FOR_CONFIRMATION" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Canceled", value: "CANCELED" },
];

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isProcessing, setIsProcessing] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchTenantBookings = async () => {
    try {
      setIsLoading(true);
      const statusParam = activeFilter === "All" ? "" : activeFilter;
      const response = await api.get(
        `/tenant/bookings?search=${searchQuery}&status=${statusParam}`,
      );
      setBookings(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data booking tenant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchTenantBookings(), 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeFilter]);

  const handleApprovePayment = async (bookingId: string) => {
    try {
      setIsProcessing(true);
      await api.patch(`/tenant/bookings/${bookingId}/approve`);
      setShowConfirmModal(false);
      fetchTenantBookings();
    } catch (error) {
      alert("Gagal menyetujui pembayaran.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPayment = async (bookingId: string) => {
    try {
      setIsProcessing(true);
      await api.patch(`/tenant/bookings/${bookingId}/reject`);
      setShowConfirmModal(false);
      fetchTenantBookings();
    } catch (error) {
      alert("Gagal menolak pembayaran.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setIsProcessing(true);
      await api.patch(`/tenant/bookings/${bookingId}/cancel`);
      setShowCancelModal(false);
      fetchTenantBookings();
    } catch (error) {
      alert("Gagal membatalkan pesanan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendReminder = async (bookingId: string) => {
    try {
      setIsProcessing(true);
      await api.post(`/tenant/bookings/${bookingId}/remind`);
      alert("Reminder email sent successfully!");
    } catch (error) {
      alert("Failed to send reminder email.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TenantLayout
      title="Transaction Management"
      subtitle="Manage your guest reservations and payments"
    >
      <div className="max-w-[1280px] mx-auto">
        <BookingFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filterOptions={FILTER_OPTIONS}
        />

        <BookingTable
          bookings={bookings}
          isLoading={isLoading}
          isProcessing={isProcessing}
          onConfirmClick={(booking) => {
            setSelectedBooking(booking);
            setShowConfirmModal(true);
          }}
          onCancelClick={(booking) => {
            setSelectedBooking(booking);
            setShowCancelModal(true);
          }}
          onRemindClick={handleSendReminder}
        />

        {showConfirmModal && (
          <ConfirmPaymentModal
            booking={selectedBooking}
            onClose={() => setShowConfirmModal(false)}
            onApprove={handleApprovePayment}
            onReject={handleRejectPayment}
            isProcessing={isProcessing}
          />
        )}

        {showCancelModal && (
          <CancelBookingModal
            booking={selectedBooking}
            onClose={() => setShowCancelModal(false)}
            onCancel={handleCancelBooking}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </TenantLayout>
  );
}
