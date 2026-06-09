import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import Navbar from "../../components/layout/Navbar";

// Import semua komponen modular yang sudah kamu buat dengan rapi
import PaymentTimerBanner from "../../components/users/payment/PaymentTimerBanner";
import MidtransPayment from "../../components/users/payment/MidtransPayment";
import BankDetailsCard from "../../components/users/payment/BankDetailsCard";
import PaymentSummaryCard from "../../components/users/payment/PaymentSummaryCard";
import ManualTransfer from "../../components/users/payment/ManualTransfer";
// (Atau kamu bisa pakai OrderSummarySidebar jika lebih suka desain yang itu)

export default function Payment() {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data pesanan secara dinamis
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/bookings/${id}`);
        setBookingData(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBookingDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">
          autorenew
        </span>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-center gap-4">
        <h2 className="text-2xl font-bold text-primary">Order Not Found</h2>
        <Link to="/bookings" className="text-primary underline">
          Return to Bookings
        </Link>
      </div>
    );
  }

  const propertyName =
    bookingData.room_unit?.room_type?.property?.name || "Evergreen Property";
  const totalAmount = Number(bookingData.total_price);

  // Asumsi dari backend ada field expired_at, sesuaikan jika namanya berbeda
  const expiredAt = bookingData.expired_at || bookingData.created_at;

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 md:px-16 py-6 md:py-10">
        {/* 1. BANNER TIMER DI PALING ATAS */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Bagian Kiri: Judul */}
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Complete Your Payment
            </h1>
            <p className="text-on-surface-variant mt-2">
              Please choose a payment method to confirm the booking.
            </p>
          </div>

          {/* Bagian Kanan: Timer */}
          <div className="w-full md:w-auto shrink-0 min-w-[300px]">
            <PaymentTimerBanner expiresAt={expiredAt} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* KIRI: Metode Pembayaran */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 2. MIDTRANS */}
            <MidtransPayment orderId={bookingData.id} />

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="mx-4 text-sm font-bold text-on-surface-variant uppercase">
                OR USE MANUAL TRANSFER
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            {/* 3. KOMPONEN MANUAL TRANSFER YANG SUDAH DIPECAH */}
            <ManualTransfer orderId={bookingData.id} amount={totalAmount} />
          </div>

          {/* KANAN: Order Summary */}
          <div className="lg:col-span-5">
            {/* 4. SUMMARY CARD / SIDEBAR */}
            <PaymentSummaryCard
              orderId={bookingData.id}
              totalAmount={totalAmount}
              propertyName={propertyName}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
