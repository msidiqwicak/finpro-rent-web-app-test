interface StayDetailsProps {
  checkInDate: Date;
  checkOutDate: Date;
  roomName: string;
}

export default function StayDetails({
  checkInDate,
  checkOutDate,
  roomName,
}: StayDetailsProps) {
  return (
    <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant animate-fade-in">
      <h3 className="font-display font-bold text-xl text-primary mb-8">
        Stay Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="space-y-2">
          <p className="text-on-surface-variant font-semibold text-xs uppercase tracking-wide">
            Check-in
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-primary">
              {checkInDate.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              })}
            </span>
            <span className="text-on-surface-variant text-sm">
              {checkInDate.getFullYear()}
            </span>
          </div>
          <p className="text-on-surface-variant text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              schedule
            </span>
            After 3:00 PM
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-on-surface-variant font-semibold text-xs uppercase tracking-wide">
            Check-out
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-primary">
              {checkOutDate.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              })}
            </span>
            <span className="text-on-surface-variant text-sm">
              {checkOutDate.getFullYear()}
            </span>
          </div>
          <p className="text-on-surface-variant text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              schedule
            </span>
            Before 11:00 AM
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-on-surface-variant font-semibold text-xs uppercase tracking-wide">
            Guests
          </p>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl text-primary">
              2 Adults
            </span>
          </div>
          <p className="text-on-surface-variant text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">pets</span>1
            Dog (Authorized)
          </p>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            eco
          </span>
          <p className="text-sm font-semibold">{roomName}</p>
        </div>
        <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_florist
          </span>
          <p className="text-sm font-semibold">Zero Waste Initiative</p>
        </div>
      </div>
    </section>
  );
}
