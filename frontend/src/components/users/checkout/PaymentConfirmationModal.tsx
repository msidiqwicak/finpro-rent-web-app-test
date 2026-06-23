interface PaymentConfirmationModalProps {
  isOpen: boolean;
  status: "success" | "pending" | "error" | null;
  orderId: string;
  amount: number;
  onClose: () => void;
}

export default function PaymentConfirmationModal({
  isOpen,
  status,
  orderId,
  amount,
  onClose,
}: PaymentConfirmationModalProps) {
  if (!isOpen || !status) return null;

  // Format Rupiah
  const formatRp = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  // Konfigurasi tampilan berdasarkan status
  const config = {
    success: {
      icon: "check_circle",
      iconColor: "text-emerald-500 bg-emerald-50",
      title: "Payment Success!",
      description:
        "Thank you! We have received your payment and your order has been automatically confirmed.",
    },
    pending: {
      icon: "schedule",
      iconColor: "text-amber-500 bg-amber-50",
      title: "Pending Payment",
      description:
        "Your order has been successfully created. Please complete the payment according to the instructions on Midtrans.",
    },
    error: {
      icon: "cancel",
      iconColor: "text-rose-500 bg-rose-50",
      title: "Payment Failed",
      description:
        "An error occurred while processing your transaction. Please try again later.",
    },
  }[status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-outline-variant/30 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        {/* Animated Icon */}
        <div className={`p-4 rounded-full mb-6 ${config.iconColor} scale-110`}>
          <span
            className="material-symbols-outlined text-4xl block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {config.icon}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-primary mb-2">{config.title}</h3>
        <p className="text-on-surface-variant text-sm mb-6 px-2 leading-relaxed">
          {config.description}
        </p>

        {/* Transaction Details Card */}
        {status !== "error" && (
          <div className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 mb-8 text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant font-medium">
                Order ID
              </span>
              <span className="text-primary font-bold font-mono">
                {orderId.split("-")[0]}
              </span>
            </div>
            <div className="flex justify-between text-xs border-t border-outline-variant/10 pt-2">
              <span className="text-on-surface-variant font-medium">
                Total Payment
              </span>
              <span className="text-secondary font-bold">
                {formatRp(amount)}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer border-none"
        >
          {status === "success" ? "Lihat Daftar Pesanan" : "Tutup"}
        </button>
      </div>
    </div>
  );
}
