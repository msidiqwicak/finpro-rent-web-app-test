import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import PaymentTimerBanner from "../components/payment/PaymentTimerBanner";
import BankDetailsCard from "../components/payment/BankDetailsCard";
import PaymentUploadCard from "../components/payment/PaymentUploadCard";
import OrderSummarySidebar from "../components/payment/OrderSummarySidebar";

export default function Payment() {
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil Booking ID dari URL (/payment/:id)

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!file || !id) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("bookingId", id);
      formData.append("amount", "500000");
      formData.append("method", "TRANSFER_BANK");

      // 1. UBAH DI SINI: Gunakan "image" sesuai dengan uploadProof.single("image")
      formData.append("image", file);

      // 2. UBAH DI SINI: Tambahkan "/upload" di akhir URL
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
            <PaymentTimerBanner initialSeconds={59 * 60 + 45} />
            <BankDetailsCard />
            <PaymentUploadCard file={file} onFileSelect={setFile} />

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 mt-2">
              <button className="w-full sm:w-auto px-6 py-3 rounded-full font-label-md text-red-600 hover:bg-red-50 transition-colors">
                Cancel Booking
              </button>
              <button
                onClick={handleSubmit}
                disabled={!file}
                className="w-full sm:w-auto px-8 py-3 rounded-full font-label-md bg-primary text-on-primary disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-colors shadow-sm"
              >
                Submit Proof
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <OrderSummarySidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
