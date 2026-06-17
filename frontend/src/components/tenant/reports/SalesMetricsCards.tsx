import React from "react";

interface SalesMetricsCardsProps {
  totalRevenue: number;
  totalBookings: number;
  avgRate: number;
  formatCurrency: (amount: number) => string;
}

export default function SalesMetricsCards({
  totalRevenue,
  totalBookings,
  avgRate,
  formatCurrency,
}: SalesMetricsCardsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 md:mb-12">
      <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>
        <p className="text-on-surface-variant text-sm font-bold mb-1 uppercase tracking-wider">
          Total Revenue
        </p>
        <h3 className="font-headline-sm text-2xl md:text-3xl font-bold text-primary truncate">
          {formatCurrency(totalRevenue)}
        </h3>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined">calendar_month</span>
          </div>
        </div>
        <p className="text-on-surface-variant text-sm font-bold mb-1 uppercase tracking-wider">
          Total Bookings
        </p>
        <h3 className="font-headline-sm text-2xl md:text-3xl font-bold text-primary">
          {totalBookings}
        </h3>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
        </div>
        <p className="text-on-surface-variant text-sm font-bold mb-1 uppercase tracking-wider">
          Avg Transaction
        </p>
        <h3 className="font-headline-sm text-2xl md:text-3xl font-bold text-primary truncate">
          {formatCurrency(avgRate)}
        </h3>
      </div>
    </section>
  );
}
