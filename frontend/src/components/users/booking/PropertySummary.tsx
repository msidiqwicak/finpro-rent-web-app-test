interface PropertySummaryProps {
  propertyName: string;
  location: string;
  isCanceled: boolean;
  // Tambahan props untuk data Host/Tenant
  hostName?: string;
  hostAvatar?: string | null;
  hostDescription?: string;
  propertyImage?: string;
}

export default function PropertySummary({
  propertyName,
  location,
  isCanceled,
  hostName = "Property Host", // Fallback nama jika kosong
  hostAvatar,
  hostDescription = "Verified Host", // Fallback deskripsi jika kosong
  propertyImage,
}: PropertySummaryProps) {
  // Jika host tidak punya foto profil, gunakan DiceBear dengan seed nama mereka
  const avatarUrl =
    hostAvatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(hostName)}&backgroundColor=061b0e`;
  const imageUrl =
    propertyImage ||
    "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop";
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {/* Image Card - Fixed Height */}
      <div className="relative h-72 md:h-80 rounded-xl overflow-hidden shadow-sm group w-full">
        <img
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isCanceled ? "grayscale-[40%] brightness-90" : ""}`}
          src={imageUrl}
          alt={propertyName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white pr-6">
          <h2 className="font-display font-bold text-xl mb-1 line-clamp-2">
            {propertyName}
          </h2>
          <p className="flex items-center gap-1 text-sm opacity-90 truncate">
            <span className="material-symbols-outlined text-sm shrink-0">
              location_on
            </span>
            <span className="truncate">{location}</span>
          </p>
        </div>
      </div>

      {/* Host Details - Fixed Height */}
      <div className="h-72 md:h-80 bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant flex flex-col justify-between w-full overflow-hidden">
        <div>
          <h3 className="font-semibold text-xs text-on-surface-variant uppercase tracking-wider mb-6">
            Your Host
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-surface-variant shrink-0">
              <img
                alt={hostName}
                className="w-full h-full object-cover"
                src={avatarUrl}
              />
            </div>
            <div className="min-w-0">
              {" "}
              {/* min-w-0 penting agar teks bisa di-truncate jika terlalu panjang */}
              <p className="font-display font-bold text-lg text-primary capitalize truncate">
                {hostName}
              </p>
              <p className="text-on-surface-variant text-sm flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-secondary text-[18px] shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="truncate">{hostDescription}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
