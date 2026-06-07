import { useState } from "react";

export default function WaitingConfirmation() {
  const [actionStatus, setActionStatus] = useState<"approve" | "reject" | null>(
    null,
  );

  const handleAction = (type: "approve" | "reject") => {
    // TODO: Panggil API update status di sini
    setActionStatus(null);
  };

  return (
    <div className="space-y-8">
      {/* Transaction Status Banner */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-secondary-container/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary text-3xl">
              hourglass_empty
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-headline-sm text-on-surface">
                Order #EE-2041
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md">
                Menunggu Konfirmasi
              </span>
            </div>
            <p className="text-on-surface-variant mt-1 font-body-md text-sm">
              Submitted on Oct 24, 2023 • 14:22 PM
            </p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={() => setActionStatus("reject")}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl border-2 border-error text-error font-label-md hover:bg-error/5 active:scale-95 transition-all cursor-pointer"
          >
            Reject Payment
          </button>
          <button
            onClick={() => setActionStatus("approve")}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-primary-container text-on-primary font-label-md hover:brightness-125 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            Approve Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  receipt_long
                </span>
                Proof of Transfer
              </h3>
            </div>
            <div className="relative group cursor-zoom-in overflow-hidden rounded-2xl border border-outline-variant bg-surface-container">
              <img
                alt="Payment Receipt"
                className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-700"
                src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2071&auto=format&fit=crop"
              />
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <section className="bg-primary-container text-on-primary rounded-3xl p-8 shadow-xl">
            <h3 className="font-headline-sm mb-6 text-on-primary-fixed">
              Payment Summary
            </h3>
            <div className="space-y-4 font-body-md text-sm">
              <div className="flex justify-between">
                <span className="text-on-primary-fixed-variant">
                  Cabin Rate (3 nights)
                </span>
                <span>$1,350.00</span>
              </div>
              <div className="pt-4 mt-4 border-t border-on-primary/10 flex justify-between items-end">
                <span className="text-on-primary-fixed-variant font-label-md">
                  Total Paid
                </span>
                <span className="text-3xl font-bold text-on-primary">
                  $1,480.00
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal Action */}
      {actionStatus && (
        <div className="fixed inset-0 bg-primary-container/40 backdrop-blur-sm z-[60] flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-surface rounded-[32px] p-10 max-w-sm w-full text-center shadow-2xl">
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${actionStatus === "approve" ? "bg-secondary-fixed" : "bg-error-container"}`}
            >
              <span
                className={`material-symbols-outlined text-5xl ${actionStatus === "approve" ? "text-secondary" : "text-error"}`}
              >
                {actionStatus === "approve" ? "check_circle" : "cancel"}
              </span>
            </div>
            <h3 className="font-headline-sm text-on-surface mb-2">
              {actionStatus === "approve"
                ? "Approve Payment?"
                : "Reject Payment?"}
            </h3>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setActionStatus(null)}
                className="flex-1 py-3 border border-outline rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={() => handleAction(actionStatus)}
                className={`flex-1 py-3 text-white rounded-xl ${actionStatus === "approve" ? "bg-secondary" : "bg-error"}`}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
