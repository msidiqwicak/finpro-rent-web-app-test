// src/components/booking/PropertyCard.tsx
import { formatDateShort, formatDateFull } from "./Utils";

interface PropertyCardProps {
  propertyName: string;
  locationCity: string;
  imageUrl: string;
  createdAt: string;
  checkIn: string;
  checkOut: string;
  isCanceled?: boolean; // Opsional: Untuk efek grayscale jika status CANCELED
}

export default function PropertyCard({
  propertyName,
  locationCity,
  imageUrl,
  createdAt,
  checkIn,
  checkOut,
  isCanceled = false,
}: PropertyCardProps) {
  return (
    <section
      className={`bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_8px_24px_-4px_rgba(27,48,34,0.06)] border border-surface-container ${isCanceled ? "opacity-80" : ""}`}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 h-44 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container">
          <img
            alt={propertyName}
            className={`w-full h-full object-cover ${isCanceled ? "grayscale" : ""}`}
            src={
              imageUrl ||
              "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070&auto=format&fit=crop"
            }
          />
        </div>
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3
                  className={`text-xl font-semibold mb-1 ${isCanceled ? "text-on-surface-variant" : "text-primary"}`}
                >
                  {propertyName}
                </h3>
                <p className="text-on-surface-variant flex items-center gap-1 text-sm">
                  <span className="material-symbols-outlined text-lg">
                    location_on
                  </span>
                  {locationCity}
                </p>
              </div>
              {/* Badge Eco (Bisa disesuaikan props jika dinamis) */}
              {!isCanceled && (
                <span className="flex items-center gap-1 bg-primary-fixed px-3 py-1 rounded-full text-xs text-on-primary-fixed font-medium">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    eco
                  </span>
                  Eco-Certified
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Dipesan pada: {formatDateFull(createdAt)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant">
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                Check-in
              </p>
              <p className="text-sm font-semibold">
                {formatDateShort(checkIn)}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">14:00 WIB</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                Check-out
              </p>
              <p className="text-sm font-semibold">
                {formatDateShort(checkOut)}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">12:00 WIB</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
