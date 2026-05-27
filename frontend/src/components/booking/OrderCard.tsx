import React from "react";

interface OrderCardProps {
  title: string; // Digunakan untuk Nama Properti
  subtitle?: string; // BARU: Digunakan untuk Tipe Kamar (opsional agar aman)
  date: string;
  orderId: string;
  price: string;
  status: "Confirmed" | "Pending Payment";
  image: string;
}

export default function OrderCard({
  title,
  subtitle, // Tangkap prop baru di sini
  date,
  orderId,
  price,
  status,
  image,
}: OrderCardProps) {
  const isConfirmed = status === "Confirmed";

  return (
    <div className="bg-surface-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
      {/* Bagian Gambar & Badge Status */}
      <div className="h-48 w-full bg-surface-dim relative">
        <img alt={title} className="w-full h-full object-cover" src={image} />
        <div
          className={`absolute top-4 right-4 font-body font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm bg-opacity-95 shadow-sm ${
            isConfirmed
              ? "bg-primary-fixed text-on-primary-fixed"
              : "bg-secondary-container text-on-secondary-container"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isConfirmed ? "check_circle" : "schedule"}
          </span>
          {status}
        </div>
      </div>

      {/* Bagian Detail Text */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* JUDUL UTAMA (Properti) */}
          <h3 className="text-lg font-display font-bold text-primary mb-1 line-clamp-1">
            {title}
          </h3>

          {/* SUB-JUDUL (Tipe Kamar) */}
          {subtitle && (
            <p className="font-body text-sm text-on-surface-variant font-semibold mb-3 line-clamp-1">
              {subtitle}
            </p>
          )}

          {/* TEKS DETAIL (Tanggal & Nomor Order) */}
          <div className="text-on-surface-variant font-body text-sm mb-4 flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                calendar_today
              </span>
              {date}
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">tag</span>
              {orderId}
            </div>
          </div>
        </div>

        {/* Bagian Harga & Tombol */}
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-surface-high">
          <div>
            <span className="block text-on-surface-variant text-xs uppercase tracking-wider font-body font-bold mb-1">
              Total
            </span>
            <span className="text-xl font-display font-bold text-primary">
              {price}
            </span>
          </div>
          <button
            className={`text-sm font-body font-bold px-5 py-2.5 rounded-full transition-colors ${
              isConfirmed
                ? "bg-primary text-on-primary hover:opacity-90 shadow-md"
                : "bg-transparent border border-primary text-primary hover:bg-surface-low"
            }`}
          >
            {isConfirmed ? "View Details" : "Complete Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
