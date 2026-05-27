import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import PaymentTimerBanner from "../components/payment/PaymentTimerBanner";
import BankDetailsCard from "../components/payment/BankDetailsCard";
import PaymentUploadCard from "../components/payment/PaymentUploadCard";
import OrderSummarySidebar from "../components/payment/OrderSummarySidebar";

export default function Payment() {
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil Booking ID dari URL (/payment/:id)
  const [bookingData, setBookingData] = useState<any>(null);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // useEffect untuk mengecek waktu secara realtime
  useEffect(() => {
    if (!bookingData?.expires_at) return;

    const checkExpiration = () => {
      // Bandingkan waktu tenggat dengan waktu saat ini
      const timeIsUp =
        new Date(bookingData.expires_at).getTime() <= new Date().getTime();
      setIsExpired(timeIsUp);
    };

    checkExpiration(); // Cek langsung saat komponen di-render
    const intervalId = setInterval(checkExpiration, 1000); // Cek ulang setiap 1 detik

    return () => clearInterval(intervalId); // Bersihkan interval saat pindah halaman
  }, [bookingData]);

  // Ambil data booking saat halaman pertama kali dimuat
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Asumsi backend-mu punya endpoint GET /api/bookings/:id
        const response = await api.get(`/bookings/${id}`);

        setBookingData(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
        alert("Gagal memuat data pesanan. Pastikan ID pesanan valid.");
      } finally {
        setIsFetchingData(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const handleSubmit = async () => {
    // Tambahkan proteksi: pastikan file, id, dan bookingData sudah tersedia
    if (!file || !id || !bookingData) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("bookingId", id);

      formData.append("amount", bookingData.total_price.toString());

      formData.append("method", "TRANSFER_BANK");

      // 1. Gunakan "image" sesuai dengan uploadProof.single("image")
      formData.append("image", file);

      // 2. Tambahkan "/upload" di akhir URL
      const response = await api.post("/payments/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload Sukses:", response.data);
      alert("Pembayaran berhasil dikirim! Menunggu verifikasi host.");

      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Gagal mengunggah bukti pembayaran.";
      alert(`Error: ${errorMessage}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = async () => {
    // Berikan konfirmasi dialog agar user tidak tidak sengaja menekan tombol batal
    const confirmCancel = window.confirm(
      "Apakah kamu yakin ingin membatalkan pesanan ini?",
    );
    if (!confirmCancel) return;

    setIsSubmitting(true);
    try {
      await api.put(`/bookings/${id}/cancel`);
      alert("Pesanan berhasil dibatalkan.");

      navigate("/");
    } catch (error: any) {
      console.error("Gagal membatalkan pesanan:", error);
      alert("Gagal membatalkan pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-surface min-h-screen font-body-md text-on-surface pb-12">
      {/* Header */}
      <header className="bg-surface-container-lowest/80 sticky top-0 backdrop-blur-md shadow-sm flex justify-between items-center w-full px-6 md:px-16 h-16 z-50 border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="material-symbols-outlined text-primary hover:bg-surface-container-low p-2 rounded-full transition-colors"
          >
            arrow_back
          </button>
          <div className="font-headline-md text-lg text-primary">
            Evergreen Escapes
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-6 md:px-16 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-headline-md text-3xl text-primary">
            Complete Your Payment
          </h1>
          <p className="text-on-surface-variant font-body-md mt-2">
            Please transfer the funds and upload your proof to confirm the
            booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-6">
            {bookingData?.expires_at && (
              <PaymentTimerBanner expiresAt={bookingData.expires_at} />
            )}
            <BankDetailsCard />

            {/* RENDER KONDISIONAL BERDASARKAN isExpired */}
            {!isExpired ? (
              <>
                <PaymentUploadCard file={file} onFileSelect={setFile} />
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 mt-2">
                  <button
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-full font-label-md text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel Booking
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!file || isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-full font-label-md bg-primary text-on-primary disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-colors shadow-sm"
                  >
                    {isSubmitting ? "Mengunggah..." : "Submit Proof"}
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-surface-low rounded-xl p-8 text-center border border-outline-variant flex flex-col items-center mt-4">
                <span className="material-symbols-outlined text-4xl text-outline mb-3">
                  event_busy
                </span>
                <h4 className="font-headline-sm text-primary mb-2 text-lg font-bold">
                  Pemesanan Dibatalkan
                </h4>
                <p className="font-body-md text-on-surface-variant text-sm max-w-md">
                  Batas waktu pembayaran telah terlewati. Sistem telah otomatis
                  membatalkan pesanan ini. Silakan kembali ke beranda untuk
                  membuat pesanan baru.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-6 px-6 py-3 rounded-full font-label-md border border-primary text-primary hover:bg-surface-dim transition-colors"
                >
                  Kembali ke Beranda
                </button>
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <OrderSummarySidebar bookingData={bookingData} />
          </div>
        </div>
      </main>
    </div>
  );
}
