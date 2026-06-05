import { useState, useEffect } from "react";
import TenantLayout from "../../components/layout/TenantLayout"; // Sesuaikan path layout kamu
import api from "../../api/axiosConfig"; // Sesuaikan path axios kamu

export default function BookingManagement() {
  // --- States ---
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  // States untuk Modal Context
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // --- Filter Options ---
  const filterOptions = [
    { label: "Semua", value: "Semua" },
    { label: "Menunggu Pembayaran", value: "WAITING_FOR_PAYMENT" },
    { label: "Konfirmasi", value: "WAITING_FOR_CONFIRMATION" },
    { label: "Diproses", value: "CONFIRMED" },
    { label: "Dibatalkan", value: "CANCELED" },
  ];

  // --- Fetch Data dari Backend ---
  const fetchTenantBookings = async () => {
    try {
      setIsLoading(true);
      // Mengirim filter status dan kata kunci pencarian ke API khusus tenant
      const statusParam = activeFilter === "Semua" ? "" : activeFilter;
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

  // Efek Debounce untuk pencarian agar tidak membebani server
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTenantBookings();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeFilter]);

  // --- Handlers / Aksi API ---

  // 1. Setujui Pembayaran Manual Tamu
  const handleApprovePayment = async (bookingId: string) => {
    try {
      await api.patch(`/tenant/${bookingId}/approve`); // 👈 Pastikan URL ini
      setShowConfirmModal(false);
      fetchTenantBookings();
    } catch (error) {
      alert("Gagal menyetujui pembayaran.");
    }
  };

  // 2. Tolak Pembayaran Manual Tamu
  const handleRejectPayment = async (bookingId: string) => {
    try {
      await api.patch(`/tenant/${bookingId}/reject`); // 👈 Pastikan URL ini
      setShowConfirmModal(false);
      fetchTenantBookings();
    } catch (error) {
      alert("Gagal menolak pembayaran.");
    }
  };

  // 3. Batalkan Pesanan secara Sepihak oleh Tenant
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.patch(`/tenant/${bookingId}/cancel-by-tenant`); // 👈 Pastikan URL ini
      setShowCancelModal(false);
      fetchTenantBookings();
    } catch (error) {
      alert("Gagal membatalkan pesanan.");
    }
  };

  // --- Helper UI Formatter ---
  const formatStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING_FOR_CONFIRMATION":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#E7F3EF] text-[#1B3022]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B3022] mr-2"></span>
            Menunggu Konfirmasi
          </span>
        );
      case "WAITING_FOR_PAYMENT":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary-container/50 text-on-secondary-container">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span>
            Menunggu Pembayaran
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
            Diproses
          </span>
        );
      case "CANCELED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-surface-variant text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant mr-2"></span>
            Dibatalkan
          </span>
        );
      default:
        return <span className="text-xs font-bold">{status}</span>;
    }
  };

  return (
    <TenantLayout
      title="Daftar Pesanan (Bookings)"
      subtitle="Kelola reservasi dan konfirmasi pembayaran tamu Anda"
    >
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
              className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-secondary-container focus:border-primary transition-all outline-none"
              placeholder="Cari ID pesanan atau nama tamu..."
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
          </div>
        </div>

        {/* Tombol Filter Dinamis */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`px-5 py-2.5 rounded-full font-label-md text-sm transition-all border-none cursor-pointer ${
                activeFilter === opt.value
                  ? "bg-primary text-white shadow-md transform scale-105"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Table Container */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-6 py-5 text-sm text-on-surface-variant font-bold">
                  Order ID
                </th>
                <th className="px-6 py-5 text-sm text-on-surface-variant font-bold">
                  Customer
                </th>
                <th className="px-6 py-5 text-sm text-on-surface-variant font-bold">
                  Property
                </th>
                <th className="px-6 py-5 text-sm text-on-surface-variant font-bold">
                  Check-in
                </th>
                <th className="px-6 py-5 text-sm text-on-surface-variant font-bold">
                  Total Amount
                </th>
                <th className="px-6 py-5 text-sm text-on-surface-variant font-bold">
                  Status
                </th>
                <th className="px-6 py-5 text-sm text-on-surface-variant font-bold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-on-surface-variant"
                  >
                    Memuat daftar pesanan...
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((bookingItem) => (
                  <tr
                    key={bookingItem.id}
                    className="hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="px-6 py-5 font-bold text-primary">
                      #{bookingItem.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {bookingItem.users?.name || "Tamu"}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {bookingItem.users?.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm">
                      {bookingItem.room_unit?.room_type?.property?.name ||
                        "Finpro Property"}
                    </td>
                    <td className="px-6 py-5 text-sm">
                      {new Date(bookingItem.check_in).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </td>
                    <td className="px-6 py-5 font-bold text-sm">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(bookingItem.total_price))}
                    </td>
                    <td className="px-6 py-5">
                      {formatStatusBadge(bookingItem.status)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {bookingItem.status === "WAITING_FOR_CONFIRMATION" && (
                        <button
                          onClick={() => {
                            setSelectedBooking(bookingItem);
                            setShowConfirmModal(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-all border-none cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            visibility
                          </span>
                          Lihat Bukti
                        </button>
                      )}
                      {bookingItem.status === "WAITING_FOR_PAYMENT" && (
                        <button
                          onClick={() => {
                            setSelectedBooking(bookingItem);
                            setShowCancelModal(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-error text-error bg-transparent rounded-lg text-xs font-semibold hover:bg-error/5 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            cancel
                          </span>
                          Batalkan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-on-surface-variant"
                  >
                    Tidak ada pesanan masuk dalam kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS INTEGRATION --- */}

      {/* 1. Modal Konfirmasi Pembayaran Manual */}
      {showConfirmModal && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary-container/40 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in场景 fade-in zoom-in duration-200">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
              <h3 className="text-xl font-bold text-primary">
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
                <p className="text-sm text-on-surface-variant mb-1">
                  Order ID:{" "}
                  <span className="text-primary font-bold">
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
              <div className="rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-2 mb-8 aspect-video overflow-hidden">
                {/* Menampilkan bukti transfer yang diunggah dari payment table (asumsi data ada di payment[0]) */}
                <img
                  alt="Payment Receipt"
                  className="w-full h-full object-cover rounded-xl"
                  src={
                    selectedBooking.payment?.[0]?.proof_url ||
                    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop"
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleRejectPayment(selectedBooking.id)}
                  className="py-3 rounded-xl border-2 border-outline-variant text-primary font-bold hover:bg-surface-variant/20 transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                  Tolak
                </button>
                <button
                  onClick={() => handleApprovePayment(selectedBooking.id)}
                  className="py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
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
              <h3 className="text-2xl font-bold text-primary mb-2">
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
    </TenantLayout>
  );
}
