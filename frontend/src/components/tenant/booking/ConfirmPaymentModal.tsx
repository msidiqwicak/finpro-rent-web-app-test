import { useState } from "react";

interface ConfirmPaymentModalProps {
  booking: any;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing: boolean;
}

export default function ConfirmPaymentModal({
  booking,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}: ConfirmPaymentModalProps) {
  // State untuk melacak aksi apa yang sedang ingin dikonfirmasi (Approve / Reject / null)
  const [confirmAction, setConfirmAction] = useState<
    "APPROVE" | "REJECT" | null
  >(null);

  if (!booking) return null;

  // Fungsi untuk mengeksekusi aksi akhir
  const handleFinalAction = () => {
    if (confirmAction === "APPROVE") {
      onApprove(booking.id);
    } else if (confirmAction === "REJECT") {
      onReject(booking.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-primary-container/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-[fadeIn_0.3s_ease-out]">
        {/* HEADER */}
        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
          <h3 className="text-[20px] font-bold text-primary">
            Detail Pembayaran
          </h3>
          <button
            onClick={onClose}
            className="text-outline hover:text-error transition-colors bg-transparent border-none cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* BODY (INFO & GAMBAR STRUK) */}
        <div className="p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-on-surface-variant mb-2">
              Order ID:{" "}
              <span className="text-primary">
                #{booking.id.substring(0, 8).toUpperCase()}
              </span>
            </p>
            <p className="text-sm">
              Tamu: <span className="font-bold">{booking.users?.name}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-2 mb-8 aspect-video overflow-hidden group cursor-zoom-in">
            <img
              alt="Payment Receipt"
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              src={
                booking.payment?.[0]?.proof_url ||
                "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=600&auto=format&fit=crop"
              }
            />
          </div>

          {/* TOMBOL AKSI AWAL */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setConfirmAction("REJECT")} // Memicu pop-up Tolak
              className="py-4 rounded-xl border-2 border-outline-variant text-primary font-bold hover:bg-surface-variant/20 transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <span className="material-symbols-outlined">close</span>
              Tolak
            </button>
            <button
              onClick={() => setConfirmAction("APPROVE")} // Memicu pop-up Setujui
              className="py-4 rounded-xl bg-primary text-white font-bold shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Setujui
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* NESTED POP-UP UNTUK KONFIRMASI FINAL      */}
        {/* ========================================= */}
        {confirmAction && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-surface/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-3xl w-full p-8 shadow-xl border border-outline-variant/30 text-center">
              {/* Icon Dinamis berdasarkan Aksi */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  confirmAction === "APPROVE"
                    ? "bg-secondary-container text-primary"
                    : "bg-error-container text-error"
                }`}
              >
                <span className="material-symbols-outlined text-[32px]">
                  {confirmAction === "APPROVE" ? "verified" : "warning"}
                </span>
              </div>

              {/* Teks Dinamis */}
              <h3
                className={`text-2xl font-bold mb-3 ${confirmAction === "APPROVE" ? "text-primary" : "text-primary"}`}
              >
                {confirmAction === "APPROVE"
                  ? "Setujui Pembayaran?"
                  : "Tolak Pembayaran?"}
              </h3>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                {confirmAction === "APPROVE"
                  ? "Pastikan nominal pada bukti transfer sudah sesuai dengan total tagihan. Status pesanan akan diubah menjadi Confirmed."
                  : "Apakah Anda yakin bukti transfer tidak valid? Pesanan ini akan dibatalkan secara otomatis."}
              </p>

              {/* Tombol Eksekusi Dinamis */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleFinalAction}
                  disabled={isProcessing}
                  className={`w-full py-4 text-secondary rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border-none ${
                    confirmAction === "APPROVE"
                      ? "bg-secondary-container hover:bg-secondary-container/90"
                      : "bg-secondary-container hover:bg-error/90"
                  }`}
                >
                  {isProcessing && (
                    <span className="material-symbols-outlined animate-spin text-[18px]">
                      autorenew
                    </span>
                  )}
                  {isProcessing
                    ? "Memproses..."
                    : confirmAction === "APPROVE"
                      ? "Ya, Setujui"
                      : "Ya, Tolak"}
                </button>
                <button
                  onClick={() => setConfirmAction(null)} // Menutup pop-up tanpa mengeksekusi apa-apa
                  disabled={isProcessing}
                  className="w-full py-4 text-outline bg-transparent border-none font-bold hover:bg-surface-container rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
