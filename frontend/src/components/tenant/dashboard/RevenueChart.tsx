import type { DashboardStats } from "../../../pages/tenant/Dashboard";

interface Props {
  data?: DashboardStats["chartData"];
}

export default function RevenueChart({ data }: Props) {
  const safeData = data || [];

  return (
    <div className="lg:col-span-2 p-8 bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-white/20 flex flex-col justify-between transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h4 className="text-xl font-bold text-primary">Revenue Overview</h4>
          <p className="text-on-surface-variant text-sm">
            Monthly earnings for the past 6 months
          </p>
        </div>
        <select className="bg-white/50 border border-white/30 backdrop-blur-sm rounded-full px-4 py-2 font-label-md text-sm text-on-surface focus:ring-2 focus:ring-secondary outline-none cursor-pointer hover:bg-white/70 transition-all">
          <option>Last 6 Months</option>
          <option>Year to Date</option>
        </select>
      </div>

      {safeData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-on-surface-variant border-2 border-dashed border-white/40 bg-white/20 rounded-xl backdrop-blur-sm">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
            bar_chart
          </span>
          <p className="font-label-md">Data grafik belum tersedia</p>
        </div>
      ) : (
        <div className="h-64 flex justify-between gap-2 sm:gap-4 px-2 mt-4">
          {safeData.map((item, idx) => (
            <div
              key={idx}
              className="flex-1 group flex flex-col items-center justify-end h-full gap-2 cursor-pointer"
            >
              {/* Batang Grafik Kotak */}
              <div
                className={`w-full max-w-[48px] rounded-t-xl relative transition-all duration-500 ease-out border-b-0 backdrop-blur-sm ${
                  item.active
                    ? "bg-secondary shadow-md border border-secondary/20 group-hover:border-secondary-container/50 scale-y-100" // Bar Aktif: Hijau Tegas
                    : "bg-secondary/50 border border-white/40 group-hover:bg-secondary-container group-hover:scale-y-[1.02]" // Bar Inaktif: Putih Kaca -> Hijau Muda
                }`}
                style={{
                  height: item.height || "0%",
                  transformOrigin: "bottom",
                }}
              >
                {/* Tooltip Angka */}
                <div
                  className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold whitespace-nowrap pointer-events-none transition-all duration-300 ${
                    item.active
                      ? "text-secondary opacity-100 translate-y-0"
                      : "text-secondary opacity-0 group-hover:opacity-100 group-hover:-translate-y-1"
                  }`}
                >
                  {item.label}
                </div>
              </div>

              {/* Label Bulan */}
              <span
                className={`text-xs transition-colors duration-300 ${
                  item.active
                    ? "text-secondary font-bold"
                    : "text-on-surface-variant font-medium group-hover:text-secondary"
                }`}
              >
                {item.month}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
