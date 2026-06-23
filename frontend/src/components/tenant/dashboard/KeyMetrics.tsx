import type { DashboardStats } from "../../../pages/tenant/Dashboard"; // Sesuaikan path jika berbeda

interface Props {
  metrics?: DashboardStats["metrics"];
}

export default function KeyMetrics({ metrics }: Props) {
  if (!metrics) return null;

  // Helper untuk format Rupiah
  const formatRp = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    // Wrapper section dengan relative positioning untuk menampung efek cahaya (glowing)
    <section className="relative py-6 rounded-3xl overflow-hidden bg-transparent">
      {/* Ornamen Cahaya Ambient Latar Belakang (Glass Glow) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary-fixed-dim opacity-30 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-fixed opacity-30 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Grid Kartu Metrik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {/* Total Revenue */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-secondary font-bold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                trending_up
              </span>
              +{metrics.revenueGrowth}%
            </span>
          </div>
          <div className="font-label-md text-on-surface-variant text-sm mb-1">
            Total Revenue
          </div>
          <div className="text-2xl font-bold text-primary">
            {formatRp(metrics.totalRevenue)}
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">calendar_month</span>
            </div>
            <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
              Current stays
            </span>
          </div>
          <div className="font-label-md text-on-surface-variant text-sm mb-1">
            Active Bookings
          </div>
          <div className="text-2xl font-bold text-primary">
            {metrics.activeBookings}
          </div>
        </div>

        {/* Property Occupancy */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">hotel</span>
            </div>
            <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
              Average
            </span>
          </div>
          <div className="font-label-md text-on-surface-variant text-sm mb-1">
            Property Occupancy
          </div>
          <div className="text-2xl font-bold text-primary">
            {metrics.occupancy}%
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
            <span className="text-secondary font-bold text-xs uppercase tracking-wider">
              Top Rated
            </span>
          </div>
          <div className="font-label-md text-on-surface-variant text-sm mb-1">
            Average Rating
          </div>
          <div className="text-2xl font-bold text-primary">
            {metrics.averageRating}/5.0
          </div>
        </div>
      </div>
    </section>
  );
}
