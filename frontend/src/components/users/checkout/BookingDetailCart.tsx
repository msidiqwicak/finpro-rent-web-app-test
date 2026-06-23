interface BookingDetailsCardProps {
  checkInFormatted: string;
  checkOutFormatted: string;
  guestCount: number;
  diffDays: number;
}

export default function BookingDetailsCard({
  checkInFormatted,
  checkOutFormatted,
  guestCount,
  diffDays,
}: BookingDetailsCardProps) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 shadow-[0_4px_12px_rgba(27,48,34,0.04)]">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary text-[28px]">
          calendar_today
        </span>
        <h2 className="font-headline-sm text-2xl font-bold text-primary">
          Order Details
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <p className="text-caption font-bold text-xs text-on-surface-variant uppercase tracking-widest">
            Date
          </p>
          <p className="font-label-md text-base font-bold text-primary">
            {checkInFormatted} — {checkOutFormatted}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-caption font-bold text-xs text-on-surface-variant uppercase tracking-widest">
            Guest
          </p>
          <p className="font-label-md text-base font-bold text-primary">
            {guestCount} Guest
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-caption font-bold text-xs text-on-surface-variant uppercase tracking-widest">
            Duration
          </p>
          <p className="font-label-md text-base font-bold text-primary">
            {diffDays} Night
          </p>
        </div>
      </div>
    </section>
  );
}
