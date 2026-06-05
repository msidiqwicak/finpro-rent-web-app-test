import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig"; // Sesuaikan path-nya
import Navbar from "../../components/layout/Navbar";

// Memberi tahu TypeScript bahwa window.snap itu ada (bawaan script Midtrans)
declare global {
  interface Window {
    snap: any;
  }
}

export default function Payment() {
  const { id } = useParams();
  const orderId = id;
  const navigate = useNavigate();

  // State untuk Midtrans
  const [isProcessing, setIsProcessing] = useState(false);

  // State untuk Manual Upload
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. INJEKSI SCRIPT MIDTRANS SAAT HALAMAN DIBUKA
  useEffect(() => {
    // Gunakan URL Sandbox untuk testing. Jika production, hapus kata 'sandbox.'
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    scriptTag.async = true;

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  // 2. FUNGSI UNTUK MEMANGGIL POP-UP MIDTRANS
  const handleMidtransPayment = async () => {
    try {
      setIsProcessing(true);
      // Panggil backend yang tadi kita buat untuk minta Token
      const response = await api.post(`/payments/snap/${orderId}`);
      const snapToken = response.data.token;

      // Panggil Pop-up Snap Midtrans
      window.snap.pay(snapToken, {
        onSuccess: async function (result: any) {
          try {
            await api.post("/payments/sync-status", { orderId: result.order_id });
          } catch (err) {
            console.error("Gagal sinkronisasi status pembayaran:", err);
          }
          alert("Payment Success!");
          // Arahkan user ke halaman sukses atau order history
          navigate("/bookings");
        },
        onPending: async function (result: any) {
          try {
            await api.post("/payments/sync-status", { orderId: result.order_id });
          } catch (err) {
            console.error("Gagal sinkronisasi status pembayaran:", err);
          }
          alert("Waiting for your payment!");
          navigate("/bookings");
        },
        onError: function (result: any) {
          alert("Payment failed!");
          console.error(result);
        },
        onClose: function () {
          alert("You closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      console.error("Gagal memanggil Midtrans:", error);
      alert("Terjadi kesalahan saat memuat payment gateway.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Fungsi untuk Manual Upload ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
      setErrorMsg("Invalid file type. Please upload a JPG or PNG.");
      setFile(null);
      return;
    }
    if (selectedFile.size > 1048576) {
      setErrorMsg("File is too large. Maximum size is 1MB.");
      setFile(null);
      return;
    }
    setErrorMsg("");
    setFile(selectedFile);
  };

  const handleManualSubmit = () => {
    if (!file) return;
    alert("Ini nanti disambung ke API /payments/upload milikmu!");
    // Logika upload FormData ke backend ditaruh di sini
  };

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen flex flex-col antialiased">
      {/* Header */}
      <Navbar />

      <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 md:px-16 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Complete Your Payment
          </h1>
          <p className="text-on-surface-variant mt-2">
            Please choose a payment method to confirm the booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* KIRI: Metode Pembayaran */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* OPSI 1: MIDTRANS */}
            <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-primary/20 bg-primary/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary text-on-primary p-2 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">
                    Pay with Midtrans
                  </h2>
                  <p className="text-on-surface-variant">
                    Fast and secure payment with cards, e-wallets, or QRIS.
                  </p>
                </div>
              </div>

              {/* TOMBOL TRIGGER MIDTRANS */}
              <button
                onClick={handleMidtransPayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-full font-bold bg-primary text-on-primary hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>
                  {isProcessing
                    ? "Loading Pop-up..."
                    : "Proceed to Secure Payment"}
                </span>
                {!isProcessing && (
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                )}
              </button>
            </section>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="mx-4 text-sm font-bold text-on-surface-variant uppercase">
                OR USE MANUAL TRANSFER
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            {/* OPSI 2: MANUAL TRANSFER & UPLOAD */}
            <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-fixed text-on-primary-fixed p-2 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">
                    account_balance
                  </span>
                </div>
                <h2 className="text-xl font-bold text-primary">
                  Bank Transfer Details
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-surface-variant">
                  <span className="text-on-surface-variant">Bank Name</span>
                  <span className="font-bold text-primary">
                    BCA (Bank Central Asia)
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-surface-variant">
                  <span className="text-on-surface-variant">
                    Account Number
                  </span>
                  <span className="font-bold text-primary tracking-wide">
                    8492 0019 3321
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-primary mb-4">
                Upload Payment Proof
              </h2>
              <div className="border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-low transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center relative">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">
                  cloud_upload
                </span>
                <p className="font-bold text-primary mb-1">
                  Click to upload image
                </p>
                <p className="text-sm text-on-surface-variant">
                  JPG, PNG. Max: 1MB.
                </p>
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>

              {/* Status Upload Manual */}
              {errorMsg && (
                <div className="mt-4 bg-error-container text-error rounded-lg p-3 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    error
                  </span>{" "}
                  {errorMsg}
                </div>
              )}
              {file && (
                <div className="mt-4 bg-primary-fixed/30 border border-primary-fixed text-primary rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm font-bold truncate">
                    {file.name}
                  </span>
                  <button onClick={() => setFile(null)} className="text-error">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              )}

              <button
                onClick={handleManualSubmit}
                disabled={!file}
                className="w-full mt-6 py-3 rounded-full font-bold bg-secondary-container text-on-secondary-container hover:opacity-90 disabled:opacity-50 transition-colors"
              >
                Submit Manual Proof
              </button>
            </section>
          </div>

          {/* KANAN: Order Summary (Disederhanakan untuk contoh) */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden sticky top-24 p-6">
              <h3 className="text-xl font-bold text-primary mb-4">
                Order Summary
              </h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Booking ID: {orderId}
              </p>

              <div className="flex justify-between items-center border-t border-surface-variant pt-4">
                <span className="font-bold text-primary">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  Rp 500.000
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
