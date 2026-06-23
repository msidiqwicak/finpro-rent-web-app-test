import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

import BookingDetailsCard from "../../components/users/checkout/BookingDetailCart";
import ReviewNoticeCard from "../../components/users/checkout/ReviewNoticeCard";
import OrderSummarySidebar from "../../components/users/checkout/OrderSummarySidebar";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const roomTypeId = searchParams.get("roomTypeId");

  const {
    checkIn,
    checkOut,
    roomName = "Mossy Rock Retreat",
    pricePerNight = 250000,
    guestCount = 2,
    locationName = "Bandung, Jawa Barat",
    imageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
  } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!checkIn || !checkOut || !roomTypeId) {
      alert("Sesi pesanan tidak valid. Silakan pilih kamar terlebih dahulu.");
      navigate("/");
    }
  }, [checkIn, checkOut, roomTypeId, navigate]);

  const startDate = new Date(checkIn || new Date());
  const endDate = new Date(checkOut || new Date());
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const totalPrice = diffDays * pricePerNight;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const payload = {
        roomTypeId: roomTypeId,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
      };
      const bookingResponse = await api.post("/bookings", payload);
      const bookingId = bookingResponse.data.data.id;

      // Langsung arahkan ke halaman Payment
      navigate(`/payment/${bookingId}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat membuat pesanan.";
      alert(`Gagal: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!checkIn || !checkOut) return null;

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen selection:bg-secondary-container selection:text-on-secondary-container flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow pt-8 md:pt-12 pb-24 px-6 md:px-16 max-w-[1280px] mx-auto w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-7 space-y-10">
            <section>
              <h1 className="font-headline-md text-4xl font-bold text-primary mb-2">
                Selesaikan Pesanan Anda
              </h1>
              <p className="text-on-surface-variant font-body-lg text-lg">
                Tinjau pilihan Anda dan pastikan detailnya sudah benar untuk
                mengonfirmasi penginapan Anda.
              </p>
            </section>
            <BookingDetailsCard
              checkInFormatted={formatDate(checkIn)}
              checkOutFormatted={formatDate(checkOut)}
              guestCount={guestCount}
              diffDays={diffDays}
            />
            <ReviewNoticeCard />
          </div>
          <aside className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <OrderSummarySidebar
                roomName={roomName}
                locationName={locationName}
                imageUrl={imageUrl}
                diffDays={diffDays}
                pricePerNight={pricePerNight}
                totalPrice={totalPrice}
                isLoading={isLoading}
                onPaymentSubmit={handlePayment}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
