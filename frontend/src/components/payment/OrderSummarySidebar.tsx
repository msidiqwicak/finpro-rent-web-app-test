import React from "react";

// Mendefinisikan tipe data yang diterima dari Payment.tsx
interface OrderSummaryProps {
  bookingData: any;
}

export default function OrderSummarySidebar({
  bookingData,
}: OrderSummaryProps) {
  // Jika data belum ada (masih loading), tampilkan skeleton/kosong
  if (!bookingData) return null;

  // Helper untuk memformat tanggal menjadi "01 Jun 2026"
  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper untuk menghitung durasi menginap (jumlah malam)
  const calculateNights = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Helper untuk memformat angka ke Rupiah
  const formatIDR = (price: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const checkIn = bookingData.check_in;
  const checkOut = bookingData.check_out;
  const nights = calculateNights(checkIn, checkOut);
  const totalPrice = bookingData.total_price;

  // Placeholder untuk nama kamar dan lokasi.
  // (Nantinya kamu bisa ambil dinamis jika query Prisma-mu menggunakan 'include: { room_unit: ... }')
  const roomName = bookingData.room_unit?.name || "Finpro Retreat Room";
  const location = "Bandung, Jawa Barat";

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 overflow-hidden sticky top-24">
      <div className="h-48 w-full bg-surface-container relative">
        <img
          src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop"
          alt="Cabin exterior"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-headline-sm text-xl text-primary mb-1">
          {roomName}
        </h3>
        <p className="font-body-md text-on-surface-variant text-sm flex items-center gap-1 mb-6">
          <span className="material-symbols-outlined text-[16px]">
            location_on
          </span>
          {location}
        </p>

        <div className="space-y-4 border-t border-surface-container-high pt-4 mb-6">
          <div className="flex justify-between text-on-surface-variant font-body-md text-sm">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                calendar_today
              </span>{" "}
              {formatDate(checkIn)} - {formatDate(checkOut)}
            </span>
            <span>{nights} Malam</span>
          </div>
          <div className="flex justify-between text-on-surface-variant font-body-md text-sm">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                group
              </span>{" "}
              Guests
            </span>
            <span>2 Dewasa</span>{" "}
            {/* Bisa dibuat dinamis jika ada datanya di DB */}
          </div>
        </div>

        <div className="space-y-3 border-t border-surface-container-high pt-4 font-body-md text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>Tarif Kamar ({nights} malam)</span>
            <span>{formatIDR(totalPrice)}</span>
          </div>
          {/* Fee lainnya disembunyikan/dijadikan 0 karena total_price sudah mencakup semuanya */}
          <div className="flex justify-between text-on-surface-variant">
            <span>Pajak & Biaya Layanan</span>
            <span>Termasuk</span>
          </div>

          <div className="flex justify-between items-center border-t border-surface-container-high pt-4 mt-2">
            <span className="font-headline-sm text-lg text-primary">
              Total Pembayaran
            </span>
            <span className="font-headline-md text-xl text-primary">
              {formatIDR(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
