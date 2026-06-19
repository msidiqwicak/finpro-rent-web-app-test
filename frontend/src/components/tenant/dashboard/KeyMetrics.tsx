import React from "react";
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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <div className="p-6 bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant hover:border-secondary transition-all group cursor-default">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-secondary-container text-on-secondary-container group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <span className="text-secondary font-label-md flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-sm">
              trending_up
            </span>
            +{metrics.revenueGrowth}%
          </span>
        </div>
        <p className="text-on-surface-variant font-label-md mb-1 text-sm">
          Total Revenue
        </p>
        <h3 className="text-2xl font-bold text-primary">
          {formatRp(metrics.totalRevenue)}
        </h3>
      </div>

      {/* Active Bookings */}
      <div className="p-6 bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant hover:border-secondary transition-all group cursor-default">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-secondary-container text-on-secondary-container group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">event_available</span>
          </div>
          <span className="px-3 py-1 rounded-full inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container text-xs font-bold">
            Current stays
          </span>
        </div>
        <p className="text-on-surface-variant font-label-md mb-1 text-sm">
          Active Bookings
        </p>
        <h3 className="text-2xl font-bold text-primary">
          {metrics.activeBookings}
        </h3>
      </div>

      {/* Property Occupancy */}
      <div className="p-6 bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant hover:border-secondary transition-all group cursor-default">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-primary-fixed text-on-primary-fixed group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">bed</span>
          </div>
          <span className="px-3 py-1 rounded-full inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container text-xs font-bold">
            Average
          </span>
        </div>
        <p className="text-on-surface-variant font-label-md mb-1 text-sm">
          Property Occupancy
        </p>
        <h3 className="text-2xl font-bold text-primary">
          {metrics.occupancy}%
        </h3>
      </div>

      {/* Average Rating */}
      <div className="p-6 bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant hover:border-secondary transition-all group cursor-default">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-primary-fixed text-on-primary-fixed group-hover:scale-110 transition-transform">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          </div>
          <div className="px-3 py-1 rounded-full inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container text-xs font-bold">
            Top Rated
          </div>
        </div>
        <p className="text-on-surface-variant font-label-md mb-1 text-sm">
          Average Rating
        </p>
        <h3 className="text-2xl font-bold text-primary">
          {metrics.averageRating}/5.0
        </h3>
      </div>
    </section>
  );
}
