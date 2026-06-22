import { useState, useEffect } from "react";

export default function PaymentTimerBanner({
  expiresAt, // Menerima data waktu tenggat asli dari database
}: {
  expiresAt: string;
}) {
  // Fungsi untuk menghitung sisa detik (Selisih waktu target vs waktu sekarang)
  const calculateTimeLeft = () => {
    if (!expiresAt) return 0;

    const difference = new Date(expiresAt).getTime() - new Date().getTime();
    // Jika waktunya masih ada, ubah ke detik. Jika sudah lewat, kembalikan 0.
    return difference > 0 ? Math.floor(difference / 1000) : 0;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Mengecek ulang selisih waktu setiap detik agar kebal terhadap refresh/lag browser
    const timerId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Hentikan hitungan jika waktu sudah habis
      if (newTimeLeft <= 0) {
        clearInterval(timerId);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Tampilan opsional: Jika waktu benar-benar sudah habis (00:00:00)
  if (timeLeft <= 0) {
    return (
      <div className="bg-red-50 text-red-900 rounded-xl p-4 flex items-center gap-4 shadow-sm border border-red-100">
        <span className="material-symbols-outlined text-red-600">error</span>
        <div>
          <p className="text-sm font-bold">Waktu Pembayaran Habis</p>
          <p className="text-sm">Pesanan ini telah dibatalkan oleh sistem.</p>
        </div>
      </div>
    );
  }

  // Tampilan normal: Jika waktu masih ada
  return (
    <div className="bg-red-50 text-red-900 rounded-xl p-4 flex items-center gap-4 shadow-sm border border-red-100">
      <span className="material-symbols-outlined text-red-600">timer</span>
      <div>
        <p className="text-sm font-bold">Pending Payment</p>
        <p className="text-sm">
          Complete within{" "}
          <span className="font-bold tracking-wider">
            {formatTime(timeLeft)}
          </span>
        </p>
      </div>
    </div>
  );
}
