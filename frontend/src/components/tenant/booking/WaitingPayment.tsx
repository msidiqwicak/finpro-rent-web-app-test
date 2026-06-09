import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axiosConfig";
import PaymentTimer from "./PaymentTimer";

// Import komponen-komponen yang sudah dipisah
import PropertyCard from "./PropertyCard"; // Gunakan path yang benar
import GuestCard from "./GuestCard"; // Gunakan path yang benar
import PaymentSummaryCard from "./PaymentSummaryCard";
import CancelBookingModal from "./CancelBookingModal";

export default function WaitingPayment() {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Tambahan state loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setIsLoading(true);
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
      setIsProcessing(true); // Tampilkan indikator loading di tombol modal
      await api.patch(`/tenant/bookings/${id}/cancel`);
      alert(
        `Order #${id?.substring(0, 8).toUpperCase()} has been successfully cancelled.`,
      );
      setIsCancelModalOpen(false);
      navigate("/tenant/bookings");
    } catch (error) {
      alert("Gagal membatalkan pesanan.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-32">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl">
          autorenew
        </span>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="w-full text-center py-20 text-on-surface-variant">
        Data pesanan tidak ditemukan.
      </div>
    );
  }

  const shortId = id?.substring(0, 8).toUpperCase();
  const guestName = bookingData.users?.name || "Tamu";
  const propertyName =
    bookingData.room_unit?.room_type?.property?.name || "Evergreen Property";
  const locationCity =
    bookingData.room_unit?.room_type?.property?.city || "Lokasi";
  const basePrice = Number(bookingData.total_price);

  return (
    <div className="w-full relative">
      {/* Header */}
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
          {bookingData?.expires_at && (
            <PaymentTimer
              expiresAt={bookingData.expires_at}
              onExpire={() =>
                console.log(
                  "Waktu habis! Menunggu cron backend mengubah status...",
                )
              }
            />
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Pakai Reusable Components */}
        <div className="lg:col-span-2 space-y-8">
          <PropertyCard
            propertyName={propertyName}
            locationCity={locationCity}
            imageUrl={bookingData.room_unit?.room_type?.property?.image_url}
            createdAt={bookingData.created_at}
            checkIn={bookingData.check_in}
            checkOut={bookingData.check_out}
          />
          <GuestCard
            guestName={guestName}
            guestEmail={bookingData.users?.email}
          />
        </div>

        {/* Kolom Kanan: Rincian Pembayaran */}
        <div className="space-y-8">
          <PaymentSummaryCard
            basePrice={basePrice}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>

      {/* Modals */}
      {isCancelModalOpen && (
        <CancelBookingModal
          booking={bookingData} // <--- Lempar objek datanya secara utuh
          onClose={() => setIsCancelModalOpen(false)}
          onCancel={handleCancelOrder}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
