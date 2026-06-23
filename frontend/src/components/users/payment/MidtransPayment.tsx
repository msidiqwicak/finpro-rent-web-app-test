import { useState, useEffect } from "react";
import api from "../../../api/axiosConfig";

// 👇 1. Tambahkan totalAmount dan onPaymentResult di Interface
interface MidtransPaymentProps {
  orderId: string;
  totalAmount: number;
  onPaymentResult: (
    status: "success" | "pending" | "error",
    amount: number,
  ) => void;
}

declare global {
  interface Window {
    snap: any;
  }
}

// 👇 2. Terima props yang baru ditambahkan
export default function MidtransPayment({
  orderId,
  totalAmount,
  onPaymentResult,
}: MidtransPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Injeksi script Midtrans (Sangat rapi!)
  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    scriptTag.async = true;

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleMidtransPayment = async () => {
    try {
      setIsProcessing(true);
      const response = await api.post(`/payments/snap/${orderId}`);
      const snapToken = response.data.token;

      window.snap.pay(snapToken, {
        onSuccess: async function (result: any) {
          setIsProcessing(false);
          try {
            await api.post("/payments/sync-status", {
              orderId: result.order_id,
            });
          } catch (err) {
            console.error("Gagal sinkronisasi status:", err);
          }
          // 👇 3. Panggil onPaymentResult untuk memunculkan Modal Sukses
          onPaymentResult("success", totalAmount);
        },
        onPending: async function (result: any) {
          setIsProcessing(false);
          try {
            await api.post("/payments/sync-status", {
              orderId: result.order_id,
            });
          } catch (err) {
            console.error("Gagal sinkronisasi status:", err);
          }
          // 👇 4. Panggil onPaymentResult untuk memunculkan Modal Pending
          onPaymentResult("pending", totalAmount);
        },
        onError: function (result: any) {
          setIsProcessing(false);
          console.error(result);
          // 👇 5. Panggil onPaymentResult untuk memunculkan Modal Error
          onPaymentResult("error", totalAmount);
        },
        onClose: function () {
          setIsProcessing(false);
          // Hanya tertutup tanpa alert mengganggu
        },
      });
    } catch (error) {
      console.error("Gagal memanggil Midtrans:", error);
      alert("Terjadi kesalahan saat memuat payment gateway.");
      setIsProcessing(false);
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-primary/20 bg-primary/[0.02]">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary text-on-primary p-2 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">payments</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">Pay with Midtrans</h2>
          <p className="text-on-surface-variant text-sm">
            Fast and secure payment with cards, e-wallets, or QRIS.
          </p>
        </div>
      </div>

      <button
        onClick={handleMidtransPayment}
        disabled={isProcessing}
        className="w-full py-4 rounded-full font-bold bg-primary text-on-primary hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer border-none"
      >
        <span>
          {isProcessing ? "Loading Pop-up..." : "Proceed to Secure Payment"}
        </span>
        {!isProcessing && (
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        )}
      </button>
    </section>
  );
}
