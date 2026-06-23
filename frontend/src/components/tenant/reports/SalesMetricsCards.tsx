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
  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: "payments",
      color: "bg-secondary-container text-on-secondary-container",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: "calendar_month",
      color: "bg-surface-container-highest text-on-surface",
    },
    {
      label: "Avg Transaction",
      value: formatCurrency(avgRate),
      icon: "trending_up",
      color: "bg-tertiary-fixed text-on-tertiary-fixed",
      extraClasses: "sm:col-span-2 lg:col-span-1",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 md:mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow ${card.extraClasses || ""}`}
        >
          <div
            className={`w-12 h-12 mb-4 rounded-2xl flex items-center justify-center ${card.color}`}
          >
            <span className="material-symbols-outlined">{card.icon}</span>
          </div>
          <p className="text-on-surface-variant text-sm font-bold mb-1 uppercase tracking-wider">
            {card.label}
          </p>
          <h3 className="font-headline-sm text-2xl md:text-3xl font-bold text-primary truncate">
            {card.value}
          </h3>
        </div>
      ))}
    </section>
  );
}
