import React from "react";

interface Props {
  currentDate: string;
  tenantName: string;
  onAddProperty: () => void;
}

export default function WelcomeHeader({
  currentDate,
  tenantName,
  onAddProperty,
}: Props) {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 className="font-display-lg text-4xl font-bold text-primary mb-2">
          Welcome back, {tenantName}!
        </h2>
        <p className="text-on-surface-variant font-body-lg flex items-center gap-2">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            calendar_month
          </span>
          {currentDate}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onAddProperty}
          className="px-6 py-2.5 rounded-full bg-secondary text-white font-label-md hover:shadow-md transition-all cursor-pointer border-none"
        >
          Add Property
        </button>
      </div>
    </section>
  );
}
