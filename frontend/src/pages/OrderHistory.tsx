import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import OrderCard from "../components/booking/OrderCard";
import Navbar from "../components/Navbar";

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState(""); // State baru untuk filter tanggal
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing",
  );
  // Fungsi untuk menerjemahkan status Database ke status UI
  const formatStatus = (dbStatus: string) => {
    switch (dbStatus) {
      case "WAITING_FOR_PAYMENT":
        return "Pending Payment";
      case "WAITING_FOR_CONFIRMATION":
        return "Waiting Confirmation";
      case "CONFIRMED": // Sesuaikan dengan enum di Prismamu
        return "Confirmed";
      case "CANCELED": // Sesuaikan dengan enum di Prismamu
        return "Canceled";
      default:
        return dbStatus;
    }
  };
  // Ambil data dari backend setiap kali salah satu filter berubah
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Mengirimkan kedua parameter query sekaligus ke backend
        const response = await api.get(
          `/bookings?search=${searchQuery}&date=${dateQuery}`,
        );
        setOrders(response.data.data);
      } catch (error) {
        console.error("Gagal memuat riwayat pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dateQuery]); // Berjalan ulang jika searchQuery ATAU dateQuery berubah

  // Pisahkan data berdasarkan tab yang aktif
  const displayedOrders = orders.filter((order) => {
    if (activeTab === "ongoing") {
      // Masukkan semua status yang masih berjalan ke sini
      return ["WAITING_FOR_PAYMENT", "WAITING_FOR_CONFIRMATION"].includes(
        order.status,
      );
    } else {
      // Masukkan semua status yang sudah selesai/batal ke sini
      return ["CANCELED", "CONFIRMED"].includes(order.status);
    }
  });
  return (
    <div className="bg-surface min-h-screen font-body text-on-surface pb-24 md:pb-0">
      <Navbar />

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Bookings
          </h1>
          <p className="text-on-surface-variant">
            Review your past and upcoming retreats.
          </p>
        </div>
        {/* Tab Filter & Bar Pencarian Ganda */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 w-full">
          {/* Tabs Filter */}
          <div className="flex p-1 bg-surface-low rounded-lg w-full lg:w-auto border border-outline-variant">
            <button
              onClick={() => setActiveTab("ongoing")}
              className={`flex-1 lg:flex-none px-6 py-2 font-bold text-sm rounded-md transition-all ${
                activeTab === "ongoing"
                  ? "bg-surface-white text-primary shadow-sm" // Style jika aktif
                  : "text-on-surface-variant hover:text-primary" // Style jika tidak aktif
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 lg:flex-none px-6 py-2 font-bold text-sm rounded-md transition-all ${
                activeTab === "completed"
                  ? "bg-surface-white text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Completed
            </button>
          </div>

          {/* Container Group untuk Input Pencarian */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* 1. Filter Berdasarkan No Order */}
            <div className="flex flex-col gap-2 flex-grow sm:w-64">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                Order Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search order number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-surface-white border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                />

                {/* Tombol Clear (X) - Hanya muncul jika ada teks yang diketik */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")} // Otomatis mengosongkan state
                    className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant hover:text-red-600 transition-colors bg-surface-white"
                    title="Clear search"
                  >
                    close
                  </button>
                )}
              </div>
            </div>

            {/* 2. Filter Berdasarkan Tanggal */}
            <div className="flex flex-col gap-2 flex-grow sm:w-56">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                Check-in Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateQuery}
                  onChange={(e) => setDateQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-surface-white border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary transition-colors custom-date-input"
                />
                {/* Tombol Clear (X) hanya muncul jika ada tanggal yang dipilih */}
                {dateQuery && (
                  <button
                    onClick={() => setDateQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant hover:text-red-600 transition-colors bg-surface-white"
                    title="Hapus filter tanggal"
                  >
                    close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List Tampilan Kartu */}
        {isLoading ? (
          <div className="text-center py-12 text-on-surface-variant font-body">
            Memuat riwayat pesanan...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  // Title diisi dengan Nama Properti
                  title={
                    order.room_unit?.room_type?.property?.name ||
                    "Finpro Escapes Property"
                  }
                  // Subtitle diisi dengan Nama Tipe Kamar
                  subtitle={order.room_unit?.room_type?.name || "Standard Room"}
                  date={`${new Date(order.check_in).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} - ${new Date(order.check_out).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`}
                  orderId={order.id.substring(0, 8).toUpperCase()}
                  price={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(Number(order.total_price))}
                  status={formatStatus(order.status)}
                  image="https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=600&auto=format&fit=crop"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-on-surface-variant">
                Tidak ada pesanan yang cocok dengan kriteria pencarian.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
