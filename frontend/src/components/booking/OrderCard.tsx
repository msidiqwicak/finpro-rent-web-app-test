import React from "react";

interface OrderCardProps {
  title: string;
  subtitle?: string;
  date: string;
  orderId: string;
  price: string;
  status: string; // Tetap gunakan string agar bisa merespons semua status DB
  image: string;
}

export default function OrderCard({
  title,
  subtitle,
  date,
  orderId,
  price,
  status,
  image,
}: OrderCardProps) {
  // Fungsi penentu warna dan ikon badge di sudut gambar
  const getStatusConfig = () => {
    switch (status) {
      case "Pending Payment":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          icon: "schedule",
        };
      case "Waiting Confirmation":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: "hourglass_empty",
        };
      case "Confirmed":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: "check_circle",
        };
      case "Canceled":
        return { bg: "bg-red-100", text: "text-red-700", icon: "cancel" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", icon: "info" };
    }
  };

  const config = getStatusConfig();

  // Logika penentu jenis tombol
  const isPending = status === "Pending Payment";

  return (
    <div className="bg-surface-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
      {/* Bagian Gambar & Badge Status Dinamis */}
      <div className="h-48 w-full bg-surface-dim relative">
        <img alt={title} className="w-full h-full object-cover" src={image} />
        <div
          className={`absolute top-4 right-4 font-body font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm opacity-95 ${config.bg} ${config.text}`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {config.icon}
          </span>
          {status}
        </div>
      </div>

      {/* Bagian Detail Text */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-display font-bold text-primary mb-1 line-clamp-1">
            {title}
          </h3>
          {subtitle && (
            <p className="font-body text-sm text-on-surface-variant font-semibold mb-3 line-clamp-1">
              {subtitle}
            </p>
          )}
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

        {/* Bagian Harga & Tombol (Menggunakan Desain Baru Kamu!) */}
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
            className={`flex items-center gap-1 text-sm font-body font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
              isPending
                ? "bg-surface-white text-primary border border-outline-variant shadow-sm hover:shadow-md hover:bg-surface-low" // Super bersih dan halus
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {isPending ? "Complete Payment" : "View Details"}
            <span className="material-symbols-outlined text-[16px] [font-variation-settings:'FILL'_0,'wght'_300,'GRAD'_0,'opsz'_20]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
