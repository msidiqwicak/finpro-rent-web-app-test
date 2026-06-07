interface PropertySummaryProps {
  propertyName: string;
  location: string;
  isCanceled: boolean;
}

export default function PropertySummary({
  propertyName,
  location,
  isCanceled,
}: PropertySummaryProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {/* Image Card */}
      <div className="relative h-64 md:h-full rounded-xl overflow-hidden shadow-sm group">
        <img
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isCanceled ? "grayscale-[40%] brightness-90" : ""}`}
          src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop"
          alt={propertyName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h2 className="font-display font-bold text-xl mb-1">
            {propertyName}
          </h2>
          <p className="flex items-center gap-1 text-sm opacity-90">
            <span className="material-symbols-outlined text-sm">
              location_on
            </span>
            {location}
          </p>
        </div>
      </div>

      {/* Host Details */}
      <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant flex flex-col justify-between gap-6">
        <div>
          <h3 className="font-semibold text-xs text-on-surface-variant uppercase tracking-wider mb-6">
            Your Host
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img
                alt="Host"
                className="w-full h-full object-cover"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
              />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-primary">
                Sarah Jenkins
              </p>
              <p className="text-on-surface-variant text-sm flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                Superhost &amp; Conservationist
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-2 border-2 border-secondary text-secondary bg-transparent font-semibold text-sm py-3 rounded-lg hover:bg-secondary/5 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">
              chat_bubble
            </span>
            Contact Host
          </button>
          <button className="w-full flex items-center justify-center gap-2 text-on-surface-variant bg-transparent border-none font-semibold text-sm py-2 hover:text-primary transition-all cursor-pointer">
            View Full Property Details
          </button>
        </div>
      </div>
    </section>
  );
}
