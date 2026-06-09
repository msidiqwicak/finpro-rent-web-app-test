export default function BookingStatusBadge({ status }: { status: string }) {
  const baseBadgeClass =
    "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold w-[180px]";

  switch (status) {
    case "WAITING_FOR_CONFIRMATION":
      return (
        <span className={`${baseBadgeClass} bg-[#E7F3EF] text-[#1B3022]`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1B3022] mr-2 shrink-0"></span>
          <span className="truncate">Waiting Confirmation</span>
        </span>
      );
    case "WAITING_FOR_PAYMENT":
      return (
        <span
          className={`${baseBadgeClass} bg-secondary-container/30 text-on-secondary-container`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2 shrink-0"></span>
          <span className="truncate">Waiting for Payment</span>
        </span>
      );
    case "CONFIRMED":
      return (
        <div className="flex flex-col gap-1 w-[180px]">
          <span className={`${baseBadgeClass} bg-primary/10 text-primary`}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 shrink-0"></span>
            <span className="truncate">Confirmed</span>
          </span>
          <div className="flex items-center gap-1 text-[10px] text-secondary font-medium px-2 group cursor-help relative">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Reminder H-1
            <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-inverse-surface text-inverse-on-surface rounded text-[11px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-md">
              Sistem akan mengirimkan email detail booking & aturan menginap 24
              jam sebelum check-in.
            </div>
          </div>
        </div>
      );
    case "CANCELED":
      return (
        <span
          className={`${baseBadgeClass} bg-surface-variant text-on-surface-variant`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant mr-2 shrink-0"></span>
          <span className="truncate">Canceled</span>
        </span>
      );
    default:
      return (
        <span className="text-xs font-semibold w-[180px] block truncate">
          {status}
        </span>
      );
  }
}
