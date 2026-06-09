// components/payment/MidtransPayment.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosConfig";

interface MidtransPaymentProps {
  orderId: string;
}
declare global {
  interface Window {
    snap: any;
  }
}

export default function MidtransPayment({ orderId }: MidtransPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Injeksi script Midtrans
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
          try {
            await api.post("/payments/sync-status", {
              orderId: result.order_id,
            });
          } catch (err) {
            console.error("Gagal sinkronisasi status:", err);
          }
          navigate("/bookings");
        },
        onPending: async function (result: any) {
          try {
            await api.post("/payments/sync-status", {
              orderId: result.order_id,
            });
          } catch (err) {
            console.error("Gagal sinkronisasi status:", err);
          }
          navigate("/bookings");
        },
        onError: function (result: any) {
          alert("Payment failed!");
          console.error(result);
        },
        onClose: function () {
          // Hanya tertutup tanpa alert mengganggu
        },
      });
    } catch (error) {
      console.error("Gagal memanggil Midtrans:", error);
      alert("Terjadi kesalahan saat memuat payment gateway.");
    } finally {
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
