import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TenantLayout from "../../components/layout/TenantLayout";
import api from "../../api/axiosConfig";

export default function BookingManagement() {
  // --- States ---
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // States untuk Modal Context
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // --- Filter Options ---
  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Waiting For Payment", value: "WAITING_FOR_PAYMENT" },
    { label: "Waiting For Confirmation", value: "WAITING_FOR_CONFIRMATION" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Canceled", value: "CANCELED" },
  ];

  // --- Fetch Data ---
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

  // --- Handlers ---
  const handleApprovePayment = async (bookingId: string) => {
    try {
      await api.patch(`/tenant/${bookingId}/approve`);
      setShowConfirmModal(false);
      fetchTenantBookings();
    } catch (error) {
      alert("Gagal menyetujui pembayaran.");
    }
  };

  const handleRejectPayment = async (bookingId: string) => {
    try {
      await api.patch(`/tenant/${bookingId}/reject`);
      setShowConfirmModal(false);
      fetchTenantBookings();
    } catch (error) {
      alert("Gagal menolak pembayaran.");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.patch(`/tenant/${bookingId}/cancel-by-tenant`);
      setShowCancelModal(false);
      fetchTenantBookings();
    } catch (error) {
      alert("Gagal membatalkan pesanan.");
    }
  };

  const handleSendReminder = async (bookingId: string) => {
    try {
      // Opsional: Kamu bisa tambahkan state loading jika mau tombolnya disable saat loading
      await api.post(`/tenant/bookings/${bookingId}/remind`);
      alert("Reminder email sent successfully!");
    } catch (error) {
      console.error("Gagal mengirim pengingat:", error);
      alert("Failed to send reminder email.");
    }
  };

  // --- Helper UI Formatter ---
  const formatStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING_FOR_CONFIRMATION":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3EF] text-[#1B3022]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B3022] mr-2"></span>
            Waiting for Confirmation
          </span>
        );
      case "WAITING_FOR_PAYMENT":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary-container/30 text-on-secondary-container">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span>
            Waiting for Payment
          </span>
        );
      case "CONFIRMED":
        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
              Confirmed
            </span>
            <div className="flex items-center gap-1 text-[10px] text-secondary font-medium px-2 group cursor-help relative">
              <span className="material-symbols-outlined text-[14px]">
                info
              </span>
              Reminder H-1
              <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-inverse-surface text-inverse-on-surface rounded text-[11px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-md">
                Sistem akan mengirimkan email detail booking & aturan menginap
                24 jam sebelum check-in.
              </div>
            </div>
          </div>
        );
      case "CANCELED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface-variant text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant mr-2"></span>
            Canceled
          </span>
        );
      default:
        return <span className="text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <TenantLayout
      title="Manajemen Transaksi"
      subtitle="Kelola reservasi dan pembayaran tamu Anda"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Filter Bar */}
        <section className="mb-8 flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="w-full md:w-96">
            <label className="font-label-md text-sm text-on-surface-variant mb-2 block">
              Cari Order ID atau Tamu
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-secondary-container focus:border-primary transition-all text-sm outline-none"
                placeholder="Contoh: EE-12940..."
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`px-5 py-2.5 rounded-full font-semibold text-[13px] transition-all cursor-pointer border-none ${
                  activeFilter === opt.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Table Container */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(27,48,34,0.06)] hover:shadow-[0_8px_24px_rgba(27,48,34,0.08)] transition-all duration-200 border border-outline-variant/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                    Order ID
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                    Customer
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                    Property
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                    Check-in
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                    Total Amount
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-on-surface-variant text-sm"
                    >
                      <span className="material-symbols-outlined animate-spin text-primary text-2xl mb-2 block mx-auto">
                        autorenew
                      </span>
                      Memuat daftar pesanan...
                    </td>
                  </tr>
                ) : bookings.length > 0 ? (
                  bookings.map((bookingItem) => (
                    <tr
                      key={bookingItem.id}
                      className={`hover:bg-surface-container-lowest transition-colors ${bookingItem.status === "CANCELED" ? "opacity-70" : ""}`}
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm text-primary font-bold">
                          #{bookingItem.id.substring(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-on-surface">
                            {bookingItem.users?.name || "Tamu"}
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            {bookingItem.users?.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-on-surface">
                        {bookingItem.room_unit?.room_type?.property?.name ||
                          "Evergreen Property"}
                      </td>
                      <td className="py-3 px-4 text-sm text-on-surface">
                        {new Date(bookingItem.check_in).toLocaleDateString(
                          "id-ID",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-on-surface">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(bookingItem.total_price))}
                      </td>
                      <td className="py-3 px-4">
                        {formatStatusBadge(bookingItem.status)}
                      </td>
                      {/* Kolom Aksi Sesuai Kode Asli & Desain Gambar */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {bookingItem.status ===
                            "WAITING_FOR_CONFIRMATION" && (
                            <button
                              onClick={() => {
                                setSelectedBooking(bookingItem);
                                setShowConfirmModal(true);
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-[13px] hover:shadow-lg transition-all cursor-pointer border-none"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                visibility
                              </span>
                              Receipt
                            </button>
                          )}

                          {bookingItem.status === "WAITING_FOR_PAYMENT" && (
                            <button
                              onClick={() => {
                                setSelectedBooking(bookingItem);
                                setShowCancelModal(true);
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 border border-error text-error bg-transparent rounded-lg font-semibold text-[13px] hover:bg-error/5 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                cancel
                              </span>
                              Cancel
                            </button>
                          )}

                          {bookingItem.status === "CONFIRMED" && (
                            <button
                              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-semibold text-[13px] hover:shadow-lg transition-all cursor-pointer border-none"
                              onClick={() => handleSendReminder(bookingItem.id)}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                forward_to_inbox
                              </span>
                              Remind
                            </button>
                          )}

                          {/* Tombol Navigasi Detail (Berlaku untuk SEMUA status, termasuk CANCELED) */}
                          <Link
                            to={`/tenant/bookings/${bookingItem.id}`}
                            state={{ status: bookingItem.status }}
                            className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                            title="Detail Lengkap"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {/* Kamu bisa pakai open_in_new, atau gunakan visibility agar terlihat sedikit beda */}
                              open_in_new
                            </span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-on-surface-variant text-sm"
                    >
                      Tidak ada pesanan masuk dalam kategori ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center justify-between">
            <p className="text-xs font-medium text-on-surface-variant">
              Showing {bookings.length} transactions
            </p>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-all cursor-pointer disabled:opacity-50">
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>
              <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* --- MODALS --- */}
        {/* 1. Modal Konfirmasi Pembayaran */}
        {showConfirmModal && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-primary-container/40 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(false)}
            ></div>
            <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-[fadeIn_0.3s_ease-out]">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
                <h3 className="text-[20px] font-bold text-primary">
                  Konfirmasi Pembayaran
                </h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-outline hover:text-error transition-colors bg-transparent border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <p className="text-sm font-semibold text-on-surface-variant mb-2">
                    Order ID:{" "}
                    <span className="text-primary">
                      #{selectedBooking.id.substring(0, 8).toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm">
                    Tamu:{" "}
                    <span className="font-bold">
                      {selectedBooking.users?.name}
                    </span>
                  </p>
                </div>
                <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-2 mb-8 aspect-video overflow-hidden group cursor-zoom-in">
                  <img
                    alt="Payment Receipt"
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    src={
                      selectedBooking.payment?.[0]?.proof_url ||
                      "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=600&auto=format&fit=crop"
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleRejectPayment(selectedBooking.id)}
                    className="py-4 rounded-xl border-2 border-outline-variant text-primary font-bold hover:bg-surface-variant/20 transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                  >
                    <span className="material-symbols-outlined">close</span>{" "}
                    Tolak
                  </button>
                  <button
                    onClick={() => handleApprovePayment(selectedBooking.id)}
                    className="py-4 rounded-xl bg-primary text-white font-bold shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>{" "}
                    Setujui
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Modal Batalkan Pesanan */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-primary-container/40 backdrop-blur-sm"
              onClick={() => setShowCancelModal(false)}
            ></div>
            <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-error-container/30 rounded-full flex items-center justify-center text-error mx-auto mb-4">
                  <span className="material-symbols-outlined text-[32px]">
                    warning
                  </span>
                </div>
                <h3 className="text-[24px] font-bold text-primary mb-2">
                  Batalkan Pesanan?
                </h3>
                <p className="text-sm text-on-surface-variant mb-8">
                  Tindakan ini tidak dapat dibatalkan. Tamu akan menerima
                  notifikasi otomatis secara berkala.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="w-full py-4 bg-error text-white border-none rounded-xl font-bold hover:bg-error/90 transition-all cursor-pointer"
                  >
                    Ya, Batalkan Pesanan
                  </button>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="w-full py-4 text-outline bg-transparent border-none font-bold hover:bg-surface-container transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TenantLayout>
  );
}
