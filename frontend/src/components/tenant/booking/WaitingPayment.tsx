import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../api/axiosConfig"; // Sesuaikan path ini dengan lokasimu
import PaymentTimer from "./PaymentTimer";

export default function WaitingPayment() {
  const { id } = useParams(); // Ambil ID dari URL
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 1. Fetch Data Detail Booking
  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setIsLoading(true);
        // PASTIKAN API SUDAH MENGIRIM expires_at
        const response = await api.get(`/tenant/bookings/${id}`);
        setBookingData(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchBookingDetail();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      await api.patch(`/tenant/${id}/cancel`);
      alert(
        `Order #${id?.substring(0, 8).toUpperCase()} has been successfully cancelled.`,
      );
      setIsCancelModalOpen(false);
      window.location.reload(); // Atau redirect/trigger re-fetch
    } catch (error) {
      alert("Gagal membatalkan pesanan.");
      console.error(error);
    }
  };

  // Helper Formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const formatDateFull = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Tampilan Loading
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-32">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl">
          autorenew
        </span>
      </div>
    );
  }

  // Handle Jika Data Tidak Ditemukan
  if (!bookingData) {
    return (
      <div className="w-full text-center py-20 text-on-surface-variant">
        Data pesanan tidak ditemukan.
      </div>
    );
  }

  // Extract Data (Fallback jika kosong)
  const shortId = id?.substring(0, 8).toUpperCase();
  const guestName = bookingData.users?.name || "Tamu";
  const guestInitials = guestName.substring(0, 2).toUpperCase();
  const propertyName =
    bookingData.room_unit?.room_type?.property?.name || "Evergreen Property";
  const locationCity =
    bookingData.room_unit?.room_type?.property?.city || "Lokasi";
  const basePrice = Number(bookingData.total_price); // Nanti bisa dipisah ke base & tax kalau ada datanya

  return (
    <div className="w-full">
      {/* Order Detail Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/tenant/bookings"
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center"
            >
              <span className="material-symbols-outlined text-[24px]">
                arrow_back
              </span>
            </Link>
            <h2 className="font-headline-md text-3xl font-semibold text-primary">
              Waiting for Guest Payment
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs rounded-full font-bold">
              Pending Payment
            </span>
            <span className="text-on-surface-variant flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-lg">
                receipt_long
              </span>
              Order #{shortId}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="px-6 py-2.5 rounded-full border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer bg-transparent"
          >
            Cancel Order
          </button>

          {/* Panggil komponen timer yang baru dibuat, pastikan field expires_at ada dari backend */}
          {bookingData?.expires_at && (
            <PaymentTimer
              expiresAt={bookingData.expires_at}
              onExpire={() => {
                // (Opsional) Kamu bisa otomatis me-refresh halaman saat waktu habis
                console.log(
                  "Waktu habis! Menunggu cron backend mengubah status...",
                );
              }}
            />
          )}
        </div>
      </div>

      {/* Balanced Wide View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Property & Guest */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Card */}
          <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_8px_24px_-4px_rgba(27,48,34,0.06)] border border-surface-container">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 h-44 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container">
                <img
                  alt={propertyName}
                  className="w-full h-full object-cover"
                  src={
                    bookingData.room_unit?.room_type?.property?.image_url ||
                    "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070&auto=format&fit=crop"
                  }
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-1">
                        {propertyName}
                      </h3>
                      <p className="text-on-surface-variant flex items-center gap-1 text-sm">
                        <span className="material-symbols-outlined text-lg">
                          location_on
                        </span>
                        {locationCity}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 bg-primary-fixed px-3 py-1 rounded-full text-xs text-on-primary-fixed font-medium">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        eco
                      </span>
                      Eco-Certified
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-4">
                    Dipesan pada: {formatDateFull(bookingData.created_at)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant">
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                      Check-in
                    </p>
                    <p className="text-sm font-semibold">
                      {formatDateShort(bookingData.check_in)}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      14:00 WIB
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                      Check-out
                    </p>
                    <p className="text-sm font-semibold">
                      {formatDateShort(bookingData.check_out)}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      12:00 WIB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Guest Card */}
          <section className="bg-surface-container-lowest rounded-[32px] p-6 shadow-[0_8px_24px_-4px_rgba(27,48,34,0.06)] border border-surface-container">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-6">
              Guest Information
            </h3>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed text-2xl font-bold">
                {guestInitials}
              </div>
              <div className="flex-grow">
                <h4 className="text-xl font-semibold text-primary">
                  {guestName}
                </h4>
                <p className="text-on-surface-variant text-sm">Main Guest</p>
              </div>
              <a
                href={`mailto:${bookingData.users?.email}`}
                className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer no-underline"
              >
                <span className="material-symbols-outlined">mail</span>
                Contact Guest
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-surface-container-low flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">
                  alternate_email
                </span>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold">
                    {bookingData.users?.email || "-"}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">
                  call
                </span>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold">-</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Payment Summary */}
        <div className="space-y-8">
          <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_8px_24px_-4px_rgba(27,48,34,0.06)] border border-surface-container">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-6">
              Payment Summary
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Base Rate</span>
                <span className="font-medium">{formatCurrency(basePrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Taxes & Fees</span>
                <span className="font-medium">Rp 0</span>
              </div>
            </div>
            <div className="pt-6 border-t border-outline-variant flex justify-between items-center mb-8">
              <span className="text-xl font-semibold text-primary">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(basePrice)}
              </span>
            </div>
            <div className="p-4 bg-[#c0c9ba] rounded-2xl flex gap-3 items-start">
              <span className="material-symbols-outlined text-[#40493d] mt-0.5">
                info
              </span>
              <p className="text-xs text-[#40493d] leading-relaxed">
                The reservation timer ensures popular dates remain available. If
                the guest fails to pay within the allotted time, the reservation
                will be automatically cancelled and dates released.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-primary-container/40 backdrop-blur-sm"
            onClick={() => setIsCancelModalOpen(false)}
          ></div>
          <div className="bg-surface rounded-[32px] w-full max-w-md p-8 relative shadow-2xl border border-surface-container animate-[fadeIn_0.3s_ease-out]">
            <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-error text-[32px]">
                warning
              </span>
            </div>
            <h3 className="text-2xl font-semibold text-primary mb-2">
              Cancel this order?
            </h3>
            <p className="text-on-surface-variant mb-8 text-sm">
              Are you sure you want to cancel order #{shortId}? This action will
              notify {guestName} and release the dates for {propertyName}. This
              cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCancelOrder}
                className="w-full py-4 bg-error text-white rounded-2xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer border-none"
              >
                Yes, Cancel Order
              </button>
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="w-full py-4 text-on-surface hover:bg-surface-container transition-colors rounded-2xl text-sm font-semibold cursor-pointer border-none bg-transparent"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
