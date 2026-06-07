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
    <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="font-display font-bold text-3xl text-primary">
              #{shortId}
            </h1>

            {isCanceled ? (
              <span className="px-4 py-1 rounded-full font-semibold text-xs flex items-center gap-2 bg-error-container text-on-error-container">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  cancel
                </span>
                Canceled
              </span>
            ) : (
              <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full font-semibold text-xs flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[18px]"
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

          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-[18px]">
              calendar_today
            </span>
            Booked on {orderDate}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {isCanceled ? (
            <>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all shadow-md border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  calendar_today
                </span>
                Rebook Now
              </button>
              <button className="flex items-center gap-2 border border-outline-variant text-primary px-6 py-3 rounded-lg font-semibold text-sm hover:bg-surface-variant transition-all bg-transparent cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">
                  help
                </span>
                Help Center
              </button>
            </>
          ) : (
            <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all shadow-md border-none cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              Download Receipt
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
