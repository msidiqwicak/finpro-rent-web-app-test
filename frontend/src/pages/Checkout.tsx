import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // asumsikan ini adalah roomTypeId

  // 1. Menangkap data state (Ditambah NILAI DEFAULT agar aman saat dites dari URL)
  const {
    checkIn = "2026-06-20",
    checkOut = "2026-06-22",
    roomName = "Whispering Pines Retreat",
    pricePerNight = 250000,
  } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);

  // Proteksi: DI-COMMENT SEMENTARA untuk keperluan testing direct URL
  /*
  if (!location.state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-4">
          Ups, Anda belum memilih tanggal!
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Kembali
        </button>
      </div>
    );
  }
  */

  // 2. Hitung durasi menginap (selisih hari)
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimal 1 malam

  const totalPrice = diffDays * pricePerNight;

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // 2. Siapkan Payload dengan data dinamis
      const payload = {
        userId: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", // Tetap pakai ID Tamu Dummy dulu
        roomTypeId: id,

        // Ubah tanggal string dari state menjadi format ISO yang diminta backend
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
      };

      // 3. Tembak API menggunakan Axios
      const response = await api.post("/bookings", payload);

      // Mengambil ID booking dari response backend
      const bookingData = response.data.data;
      console.log("Auto-assign berhasil! Booking ID:", bookingData.id);

      // 4. Lanjut ke halaman Payment sambil membawa ID booking aslinya di URL!
      navigate(`/payment/${bookingData.id}`);
    } catch (error: any) {
      // Menangkap pesan error dari backend
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Terjadi kesalahan saat membuat pesanan.";
      alert(`Gagal: ${errorMessage}`);
      console.error("Error Detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 min-h-screen bg-surface">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-on-surface-variant hover:text-primary font-medium mb-8 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Kembali
      </button>

      <h1 className="font-headline-md text-3xl text-primary mb-8">
        Ringkasan Pesanan
      </h1>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex justify-between items-start mb-6 pb-6 border-b border-surface-container-high">
          <div>
            <h2 className="text-xl font-headline-sm text-primary">
              {roomName}
            </h2>
            <p className="text-on-surface-variant text-sm mt-1">
              Bandung, Jawa Barat
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=200&auto=format&fit=crop"
            alt="Room"
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-container p-4 rounded-lg border border-surface-container-high">
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">
              Check-in
            </p>
            <p className="font-medium text-primary">{checkIn}</p>
          </div>
          <div className="bg-surface-container p-4 rounded-lg border border-surface-container-high">
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">
              Check-out
            </p>
            <p className="font-medium text-primary">{checkOut}</p>
          </div>
        </div>

        <div className="space-y-3 font-body-md text-sm text-on-surface-variant mb-6">
          <div className="flex justify-between">
            <span>
              Rp {pricePerNight.toLocaleString("id-ID")} x {diffDays} malam
            </span>
            <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Diskon (Promo Akhir Tahun)</span>
            <span>- Rp 0</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-surface-container-high">
          <span className="font-headline-sm text-primary">
            Total Pembayaran
          </span>
          <span className="font-headline-md text-2xl font-bold text-primary">
            Rp {totalPrice.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full sm:w-auto px-8 py-3 rounded-full font-label-md bg-primary text-on-primary disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-colors shadow-sm"
      >
        {isLoading ? "Memproses..." : "Lanjutkan ke Pembayaran"}
      </button>
    </div>
  );
}
