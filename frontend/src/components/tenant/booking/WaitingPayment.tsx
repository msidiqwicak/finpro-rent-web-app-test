import { useState, useEffect } from "react";

export default function WaitingPayment() {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Simulasi waktu tersisa (contoh: 23 jam 54 menit 12 detik = 86052 detik)
  const [timeLeft, setTimeLeft] = useState(86052);

  // Logika Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCancelOrder = () => {
    alert("Order #EE-2039 has been successfully cancelled.");
    setIsCancelModalOpen(false);
    // TODO: Panggil API pembatalan pesanan di sini
  };

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Status Header Card (Compact) */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full mb-2">
              <span className="material-symbols-outlined text-[16px] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                pending
              </span>
              <span className="font-label-md uppercase tracking-wider text-xs">
                Menunggu Pembayaran
              </span>
            </div>
            <h2 className="font-headline-md text-2xl font-semibold text-primary">
              Waiting for Guest Payment
            </h2>
            <p className="text-on-surface-variant mt-1 font-body-md text-xs">
              Order placed on Oct 24, 2023 at 14:20 PM
            </p>
          </div>
          <div className="bg-surface-container rounded-xl p-3 min-w-[180px] text-center">
            <p className="font-caption text-on-surface-variant uppercase tracking-widest mb-1 text-[10px] font-medium">
              Time Remaining
            </p>
            <div className="font-headline-sm text-xl font-semibold text-primary flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                timer
              </span>
              <span>{timeLeft > 0 ? formatTime(timeLeft) : "EXPIRED"}</span>
            </div>
          </div>
        </section>

        {/* 3-Column Grid for Compact View */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Main Info (Col 8) */}
          <div className="col-span-12 lg:col-span-8 space-y-5">
            {/* Property & Guest (Side by Side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Property Overview */}
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container flex flex-col">
                <img
                  alt="Mossy Rock Retreat"
                  className="h-32 w-full object-cover"
                  src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070&auto=format&fit=crop"
                />
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="material-symbols-outlined text-secondary text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      eco
                    </span>
                    <span className="font-label-md text-secondary font-semibold text-xs">
                      Eco-Certified Cabin
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-lg font-semibold text-primary mb-1">
                    Mossy Rock Retreat
                  </h3>
                  <p className="text-on-surface-variant font-body-md text-xs flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-[16px]">
                      location_on
                    </span>
                    Olympia, WA
                  </p>
                  <div className="mt-auto pt-3 border-t border-surface-container flex justify-between">
                    <div>
                      <p className="text-on-surface-variant uppercase text-[10px] font-medium">
                        Check-in
                      </p>
                      <p className="text-on-surface text-xs font-semibold">
                        Nov 12, 2023
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-on-surface-variant uppercase text-[10px] font-medium">
                        Check-out
                      </p>
                      <p className="text-on-surface text-xs font-semibold">
                        Nov 15, 2023
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Profile */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container flex flex-col">
                <h3 className="text-on-surface-variant uppercase tracking-widest mb-4 text-[10px] font-semibold">
                  Guest Information
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    alt="Maya Indah"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-surface-container"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
                  />
                  <div>
                    <p className="text-base font-semibold text-primary">
                      Maya Indah
                    </p>
                    <p className="text-on-surface-variant text-xs">
                      2 Guests · 1 Child
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      mail
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-on-surface-variant text-[10px] font-medium leading-tight">
                        Email
                      </p>
                      <p className="text-xs font-semibold truncate">
                        maya.indah@example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      call
                    </span>
                    <div>
                      <p className="text-on-surface-variant text-[10px] font-medium leading-tight">
                        Phone
                      </p>
                      <p className="text-xs font-semibold">+62 812-3456-7890</p>
                    </div>
                  </div>
                </div>
                <button className="mt-auto w-full py-2.5 text-primary border border-primary-fixed rounded-lg text-xs font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-transparent">
                  <span className="material-symbols-outlined text-[16px]">
                    chat_bubble
                  </span>
                  Contact Guest
                </button>
              </div>
            </div>

            {/* Payment Summary */}
            <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container">
              <h3 className="text-on-surface-variant uppercase tracking-widest mb-4 text-[10px] font-semibold">
                Payment Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">
                    Base Rate (3 Nights x $240)
                  </span>
                  <span className="text-sm font-semibold">$720.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">
                    Cleaning Fee
                  </span>
                  <span className="text-sm font-semibold">$45.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">
                    Service Tax (8%)
                  </span>
                  <span className="text-sm font-semibold">$61.20</span>
                </div>
                <div className="pt-3 mt-1 border-t border-surface-container flex justify-between items-center">
                  <span className="text-lg font-semibold text-primary">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-primary">
                    $826.20
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (Actions Only) */}
          <div className="col-span-12 lg:col-span-4">
            <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container sticky top-24">
              <h3 className="text-on-surface-variant uppercase tracking-widest mb-4 text-[10px] font-semibold">
                Management Actions
              </h3>

              <div className="bg-secondary-container text-on-primary-fixed-variant rounded-xl p-3 mb-5 flex gap-2 items-start border border-primary-fixed">
                <span className="material-symbols-outlined text-[18px]">
                  info
                </span>
                <p className="text-[11px] leading-relaxed">
                  Booking is reserved but not confirmed. Timer expiration will
                  auto-cancel and release dates.
                </p>
              </div>

              <div className="space-y-2.5">
                <button className="w-full flex items-center justify-between p-3 bg-surface hover:bg-surface-container transition-colors rounded-xl group active:scale-[0.98] cursor-pointer border border-outline-variant/30">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[20px]">
                      edit
                    </span>
                    <span className="text-sm font-semibold text-on-surface">
                      Edit Details
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">
                    chevron_right
                  </span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-surface hover:bg-surface-container transition-colors rounded-xl group active:scale-[0.98] cursor-pointer border border-outline-variant/30">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[20px]">
                      print
                    </span>
                    <span className="text-sm font-semibold text-on-surface">
                      Print Invoice
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">
                    chevron_right
                  </span>
                </button>
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 bg-error-container/20 hover:bg-error-container/40 transition-colors rounded-xl group text-error active:scale-[0.98] cursor-pointer border border-error/20 mt-4"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px]">
                      cancel
                    </span>
                    <span className="text-sm font-semibold">Cancel Order</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-primary-container/40 backdrop-blur-sm"
            onClick={() => setIsCancelModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-6 text-center animate-[fadeIn_0.2s_ease-out]">
            <div className="w-14 h-14 bg-error-container/40 rounded-full flex items-center justify-center text-error mx-auto mb-4">
              <span className="material-symbols-outlined text-[28px]">
                warning
              </span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Cancel this order?
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              Are you sure you want to cancel order <strong>#EE-2039</strong>?
              This will release the dates. This cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCancelOrder}
                className="w-full py-3 bg-error text-white rounded-xl font-bold text-sm hover:bg-error/90 transition-all cursor-pointer border-none"
              >
                Yes, Cancel Order
              </button>
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="w-full py-3 text-outline bg-transparent border-none font-bold text-sm hover:bg-surface-container rounded-xl transition-all cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
