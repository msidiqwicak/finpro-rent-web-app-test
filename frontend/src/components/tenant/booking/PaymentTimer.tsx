import { useState, useEffect } from "react";

interface PaymentTimerProps {
  expiresAt: string;
  onExpire?: () => void; // Opsional: Fungsi yang dipanggil saat waktu habis (misal: otomatis refresh)
}

export default function PaymentTimer({
  expiresAt,
  onExpire,
}: PaymentTimerProps) {
  // Fungsi untuk menghitung sisa waktu dalam detik
  const calculateTimeLeft = () => {
    if (!expiresAt) return 0;
    const difference = new Date(expiresAt).getTime() - new Date().getTime();
    return difference > 0 ? Math.floor(difference / 1000) : 0;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Jika dari awal waktu sudah habis, jangan jalankan interval
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timerId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Hentikan interval jika waktu menyentuh angka 0
      if (newTimeLeft <= 0) {
        clearInterval(timerId);
        if (onExpire) onExpire(); // Panggil fungsi trigger saat expired
      }
    }, 1000);

    // Bersihkan interval saat komponen di-unmount
    return () => clearInterval(timerId);
  }, [expiresAt]); // Hanya dependensi expiresAt, agar tidak me-reset interval terus menerus

  // Format detik ke HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Tampilan 1: Jika waktu habis
  if (timeLeft <= 0) {
    return (
      <div className="px-6 py-2.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-sm font-semibold flex items-center gap-2 border border-[#ffb4ab]">
        <span className="material-symbols-outlined text-lg">error</span>
        EXPIRED
      </div>
    );
  }

  // Tampilan 2: Jika waktu masih ada
  return (
    <div className="px-6 py-2.5 rounded-full bg-[#ffdad6]/40 text-[#ba1a1a] text-sm font-semibold flex items-center gap-2 border border-[#ffdad6]">
      <span className="material-symbols-outlined text-lg">timer</span>
      Expires in
      <span className="font-bold tabular-nums animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
