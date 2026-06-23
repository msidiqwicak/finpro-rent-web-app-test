import { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import api from "../../api/axiosConfig";
import Navbar from "../../components/layout/Navbar";

import PaymentTimerBanner from "../../components/users/payment/PaymentTimerBanner";
import MidtransPayment from "../../components/users/payment/MidtransPayment";
import PaymentSummaryCard from "../../components/users/payment/PaymentSummaryCard";
import ManualTransfer from "../../components/users/payment/ManualTransfer";

import PaymentConfirmationModal from "../../components/users/checkout/PaymentConfirmationModal";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // 👈 2. Inisialisasi searchParams
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 👇 STATE UNTUK MODAL KONFIRMASI
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "pending" | "error" | null
  >(null);
  const [transactionInfo, setTransactionInfo] = useState({
    orderId: "",
    amount: 0,
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/bookings/${id}`);
        setBookingData(response.data.data);
      } catch (error: any) {
        console.error("Akses Ditolak / Gagal memuat pesanan:", error);
        alert(
          error.response?.data?.error ||
            "Pesanan tidak ditemukan atau bukan milik Anda.",
        );
        navigate("/bookings"); // Tendang kembali ke halaman bookings jika error
      } finally {
        setIsLoading(false); // 👈 Ini yang bikin loading berhenti!
      }
    };

    if (id) fetchBookingDetails();
  }, [id, navigate]);

  // 👇 CEK REDIRECT DARI MIDTRANS (GOPAY, SHOPEEPAY, DLL)
  useEffect(() => {
    if (!bookingData) return;

    const transactionStatus = searchParams.get("transaction_status");
    const orderIdParam = searchParams.get("order_id");

    if (transactionStatus && orderIdParam) {
      const amount = Number(bookingData.total_price);
      
      if (["settlement", "capture"].includes(transactionStatus)) {
        handleMidtransResult("success", amount);
      } else if (transactionStatus === "pending") {
        handleMidtransResult("pending", amount);
      } else if (["deny", "cancel", "expire"].includes(transactionStatus)) {
        handleMidtransResult("error", amount);
      }
      
      // Bersihkan URL dari parameter Midtrans agar tidak re-trigger saat user refresh page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [bookingData, searchParams]);

  // 👇 FUNGSI UNTUK MENANGKAP HASIL DARI MIDTRANS
  const handleMidtransResult = (
    status: "success" | "pending" | "error",
    amount: number,
  ) => {
    setTransactionInfo({ orderId: id || "", amount });
    setPaymentStatus(status);
    setModalOpen(true);
  };

  // 👇 FUNGSI SAAT MODAL DITUTUP
  const handleModalClose = () => {
    setModalOpen(false);
    if (paymentStatus === "success" || paymentStatus === "pending") {
      navigate("/bookings");
    }
  };

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
  const expiresAt = bookingData.expires_at || bookingData.created_at;

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 md:px-16 py-6 md:py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Complete Your Payment
            </h1>
            <p className="text-on-surface-variant mt-2">
              Please choose a payment method to confirm the booking.
            </p>
          </div>
          <div className="w-full md:w-auto shrink-0 min-w-[300px]">
            <PaymentTimerBanner expiresAt={expiresAt} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 👇 Berikan props onPaymentResult ke komponen Midtrans */}
            <MidtransPayment
              orderId={bookingData.id}
              totalAmount={totalAmount}
              onPaymentResult={handleMidtransResult}
            />

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="mx-4 text-sm font-bold text-on-surface-variant uppercase">
                OR USE MANUAL TRANSFER
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            <ManualTransfer orderId={bookingData.id} amount={totalAmount} />
          </div>

          <div className="lg:col-span-5">
            <PaymentSummaryCard
              orderId={bookingData.id}
              totalAmount={totalAmount}
              propertyName={propertyName}
            />
          </div>
        </div>
      </main>

      {/* 👇 RENDER MODAL DI BAWAH SINI */}
      <PaymentConfirmationModal
        isOpen={modalOpen}
        status={paymentStatus}
        orderId={transactionInfo.orderId}
        amount={transactionInfo.amount}
        onClose={handleModalClose}
      />
    </div>
  );
}
