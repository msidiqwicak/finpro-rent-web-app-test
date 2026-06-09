// src/components/booking/GuestCard.tsx

interface GuestCardProps {
  guestName: string;
  guestEmail: string;
  guestPhone?: string; // Opsional
}

export default function GuestCard({
  guestName,
  guestEmail,
  guestPhone = "-",
}: GuestCardProps) {
  const guestInitials = guestName.substring(0, 2).toUpperCase();

  return (
    <section className="bg-surface-container-lowest rounded-[32px] p-6 shadow-[0_8px_24px_-4px_rgba(27,48,34,0.06)] border border-surface-container">
      <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-6">
        Guest Information
      </h3>
      <div className="flex items-center gap-6 mb-6">
        <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed text-2xl font-bold">
          {guestInitials}
        </div>
        <div className="flex-grow">
          <h4 className="text-xl font-semibold text-primary">{guestName}</h4>
          <p className="text-on-surface-variant text-sm">Main Guest</p>
        </div>
        <a
          href={`mailto:${guestEmail}`}
          className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer no-underline"
        >
          <span className="material-symbols-outlined">mail</span>
          Contact Guest
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-2xl bg-surface-container-low flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">
            alternate_email
          </span>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">
              Email Address
            </p>
            <p className="text-sm font-semibold">{guestEmail || "-"}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-low flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">call</span>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">
              Phone Number
            </p>
            <p className="text-sm font-semibold">{guestPhone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
