import { useNavigate } from "react-router-dom";

interface StatusHeaderProps {
  shortId: string;
  isCanceled: boolean;
  status: string;
  orderDate: string;
}

export default function StatusHeader({
  shortId,
  isCanceled,
  status,
  orderDate,
}: StatusHeaderProps) {
  const navigate = useNavigate();

  return (
    // 1. Padding diperkecil di mobile (p-5), kembali normal di desktop (md:p-8)
    <section className="bg-white p-5 md:p-8 rounded-xl shadow-sm border border-outline-variant animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-4">
        <div className="w-full">
          {/* 2. flex-wrap ditambahkan agar jika layar sangat kecil, label status akan turun ke bawah ID */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-2">
            {/* Ukuran teks disesuaikan untuk mobile (text-2xl) */}
            <h1 className="font-display font-bold text-2xl md:text-3xl text-primary">
              #{shortId}
            </h1>

            {isCanceled ? (
              <span className="px-3 md:px-4 py-1 rounded-full font-semibold text-[11px] md:text-xs flex items-center gap-1.5 md:gap-2 bg-error-container border border-error-outline text-on-error-container">
                <span
                  className="material-symbols-outlined text-[16px] md:text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  cancel
                </span>
                Canceled
              </span>
            ) : (
              <span className="bg-secondary-container text-on-secondary-container px-3 md:px-4 py-1 rounded-full font-semibold text-[11px] md:text-xs flex items-center gap-1.5 md:gap-2">
                <span
                  className="material-symbols-outlined text-[16px] md:text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                {status === "WAITING_FOR_CONFIRMATION"
                  ? "Waiting Confirmation"
                  : "Confirmed"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant text-xs md:text-sm">
            <span className="material-symbols-outlined text-[16px] md:text-[18px]">
              calendar_today
            </span>
            Booked on {orderDate}
          </div>
        </div>

        {/* 3. Tombol menjadi w-full di mobile agar mudah ditekan, dan kembali ke ukuran aslinya di desktop (sm:w-auto) */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 mt-2 md:mt-0">
          {isCanceled ? (
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 bg-primary text-white w-full sm:w-auto px-6 py-3 md:py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-md border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                calendar_today
              </span>
              Rebook Now
            </button>
          ) : (
            <button
              onClick={() => navigate("/bookings")}
              className="flex items-center justify-center gap-2 bg-primary text-white w-full sm:w-auto px-6 py-3 md:py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-md border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                list
              </span>
              View Bookings
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
