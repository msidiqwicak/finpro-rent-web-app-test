import React from "react";
import type { DashboardStats } from "../../../pages/tenant/Dashboard";

interface Props {
  data?: DashboardStats["chartData"];
}

export default function RevenueChart({ data }: Props) {
  const safeData = data || [];

  return (
    <div className="lg:col-span-2 p-8 bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant flex flex-col justify-between">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-bold text-primary">Revenue Overview</h4>
          <p className="text-on-surface-variant text-sm">
            Monthly earnings for the past 6 months
          </p>
        </div>
        <select className="bg-surface-container-low border-none rounded-full px-4 py-2 font-label-md text-sm text-on-surface focus:ring-secondary outline-none cursor-pointer">
          <option>Last 6 Months</option>
          <option>Year to Date</option>
        </select>
      </div>

      {safeData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-on-surface-variant border-2 border-dashed border-outline-variant rounded-xl">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
            bar_chart
          </span>
          <p className="font-label-md">Data grafik belum tersedia</p>
        </div>
      ) : (
        <div className="h-64 flex justify-between gap-4 px-2 mt-4">
          {safeData.map((item, idx) => (
            <div
              key={idx}
              className="flex-1 group flex flex-col items-center justify-end h-full gap-2"
            >
              <div
                className={`w-full rounded-t-xl relative transition-colors ${
                  item.active
                    ? "bg-primary-container group-hover:bg-secondary/80"
                    : "bg-secondary-container group-hover:bg-primary/80"
                }`}
                style={{ height: item.height || "0%" }}
              >
                {/* 👇 PERUBAHAN: Hapus opacity-0 dan rapikan gaya teksnya 👇 */}
                <div
                  className={`absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold whitespace-nowrap pointer-events-none transition-colors ${
                    item.active
                      ? "text-primary"
                      : "text-on-surface-variant group-hover:text-primary"
                  }`}
                >
                  {item.label}
                </div>
              </div>
              <span
                className={`text-xs ${
                  item.active
                    ? "text-primary font-bold"
                    : "text-on-surface-variant"
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
