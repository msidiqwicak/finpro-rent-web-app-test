interface CancelBookingModalProps {
  booking: any;
  onClose: () => void;
  onCancel: (id: string) => void;
  isProcessing?: boolean;
}

export default function CancelBookingModal({
  booking,
  onClose,
  onCancel,
  isProcessing = false,
}: CancelBookingModalProps) {
  // Jika data booking belum siap (null/undefined), jangan render apapun
  if (!booking) return null;

  // Ekstrak data yang dibutuhkan langsung di dalam modal
  const shortId = booking.id?.substring(0, 8).toUpperCase();
  const guestName = booking.users?.name || "Tamu";
  const propertyName =
    booking.room_unit?.room_type?.property?.name || "Properti";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-primary-container/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-[fadeIn_0.3s_ease-out]">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-error-container/30 rounded-full flex items-center justify-center text-error mx-auto mb-6">
            <span className="material-symbols-outlined text-[32px]">
              warning
            </span>
          </div>
          <h3 className="text-[24px] font-bold text-primary mb-2">
            Batalkan Pesanan?
          </h3>
          <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
            Apakah Anda yakin ingin membatalkan pesanan{" "}
            <span className="font-bold">#{shortId}</span>? Tindakan ini akan
            memberitahu <span className="font-bold">{guestName}</span> dan
            membuka kembali ketersediaan tanggal untuk kamar di{" "}
            <span className="font-bold">{propertyName}</span>. Tindakan ini
            tidak dapat dibatalkan.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onCancel(booking.id)}
              disabled={isProcessing}
              className="w-full py-4 bg-secondary-container text-on-secondary-container border-none rounded-xl font-bold hover:bg-error/90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && (
                <span className="material-symbols-outlined animate-spin">
                  autorenew
                </span>
              )}
              {isProcessing ? "Membatalkan..." : "Ya, Batalkan Pesanan"}
            </button>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full py-4 text-outline bg-transparent border-none font-bold hover:bg-surface-container transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
