import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import Navbar from "../../components/layout/Navbar";
import StatusHeader from "../../components/users/booking/StatusHeader";
import PropertySummary from "../../components/users/booking/PropertySummary";
import StayDetails from "../../components/users/booking/StayDetails";
import PaymentBreakdown from "../../components/users/booking/PaymentBreakdown";

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Gagal memuat detail pesanan.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBookingDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined text-5xl text-error">
            error
          </span>
          <p className="text-on-surface-variant">
            {error || "Pesanan tidak ditemukan"}
          </p>
          <button
            onClick={() => navigate("/bookings")}
            className="px-6 py-2 bg-primary text-white rounded-lg font-bold border-none cursor-pointer"
          >
            Kembali ke Daftar Pesanan
          </button>
        </div>
      </div>
    );
  }

  // --- Data Formatting Engine ---
  const isCanceled = booking.status === "CANCELED";
  const propertyName =
    booking.room_unit?.room_type?.property?.name || "Finpro Escapes Property";
  const roomName = booking.room_unit?.room_type?.name || "Standard Room";
  const location = "Olympic National Park, Washington";

  const shortId = booking.id.substring(0, 8).toUpperCase();
  const orderDate = new Date(booking.created_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const checkInDate = new Date(booking.check_in);
  const checkOutDate = new Date(booking.check_out);

  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const pricePerNight = Number(
    booking.room_unit?.room_type?.price_per_night || 0,
  );
  const baseTotal = nights * pricePerNight;
  const totalPrice = Number(booking.total_price);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-12 pb-12 px-6 md:px-16 max-w-[1280px] mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <StatusHeader
              shortId={shortId}
              isCanceled={isCanceled}
              status={booking.status}
              orderDate={orderDate}
            />

            {/* Canceled Alert Banner Callout */}
            {isCanceled && (
              <div className="bg-error-container/20 border border-error-container p-6 rounded-xl animate-fade-in flex gap-4 items-start">
                <span className="material-symbols-outlined text-error">
                  error
                </span>
                <div>
                  <h4 className="font-bold text-error mb-1">
                    Booking Canceled
                  </h4>
                  <p className="text-on-error-container text-sm leading-relaxed">
                    This booking was canceled. Your refund has been processed to
                    your original payment method.
                  </p>
                </div>
              </div>
            )}

            <PropertySummary
              propertyName={propertyName}
              location={location}
              isCanceled={isCanceled}
            />

            <StayDetails
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              roomName={roomName}
            />
          </div>

          {/* Right Column (lg:col-span-4) */}
          <PaymentBreakdown
            shortId={shortId}
            pricePerNight={pricePerNight}
            nights={nights}
            baseTotal={baseTotal}
            totalPrice={totalPrice}
            isCanceled={isCanceled}
            formatCurrency={formatCurrency}
          />
        </div>
      </main>
    </div>
  );
}
