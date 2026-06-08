import { useState } from "react";

interface PaymentProofViewerProps {
  method: string;
  proofUrl?: string | null;
}

export default function PaymentProofViewer({
  method,
  proofUrl,
}: PaymentProofViewerProps) {
  // State modal dipindah ke sini!
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-6 p-5 rounded-2xl bg-surface-container-low border border-outline-variant">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-on-surface-variant uppercase font-semibold">
            Method
          </span>
          <span className="text-sm font-bold text-primary">{method}</span>
        </div>

        {proofUrl ? (
          <div className="mt-4">
            <p className="text-xs text-on-surface-variant mb-2">
              Transfer Proof / Receipt:
            </p>
            {/* Thumbnail Bukti Pembayaran */}
            <div
              className="w-full h-32 rounded-xl bg-surface-container overflow-hidden cursor-pointer border border-outline-variant hover:opacity-90 transition-opacity relative group"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={proofUrl}
                alt="Payment Proof Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white">
                  zoom_in
                </span>
                <span className="text-white text-xs font-medium mt-1">
                  Zoom
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-secondary-container/50 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg">
              check_circle
            </span>
            <p className="text-xs text-on-secondary-container">
              Automatic payment via Gateway.
            </p>
          </div>
        )}
      </div>

      {/* Modal Fullscreen Bukti Pembayaran */}
      {isModalOpen && proofUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-2xl flex flex-col items-center animate-[fadeIn_0.2s_ease-out]">
            <button
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors bg-transparent border-none cursor-pointer flex items-center gap-2"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="text-sm font-medium">Close</span>
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            <img
              src={proofUrl}
              alt="Full Payment Proof"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
