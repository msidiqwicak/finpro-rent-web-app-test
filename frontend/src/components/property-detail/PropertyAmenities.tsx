import React from 'react';

const AMENITY_ICONS: Record<string, string> = {
  wifi: 'wifi', 'Wi-Fi': 'wifi', ac: 'ac_unit', AC: 'ac_unit',
  parking: 'local_parking', pool: 'pool', kitchen: 'kitchen',
  tv: 'tv', TV: 'tv', gym: 'fitness_center', laundry: 'local_laundry_service',
  balcony: 'balcony', garden: 'yard', spa: 'spa', restaurant: 'restaurant',
  elevator: 'elevator', security: 'security', 'hot water': 'hot_tub',
};

interface PropertyAmenitiesProps {
  amenities: string[];
}

export default function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  if (amenities.length === 0) return null;

  return (
    <div className="mb-8 pb-8 border-b border-outline-variant/50">
      <h2 className="font-display font-bold text-[20px] text-on-surface mb-4">Amenities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {amenities.map((a) => (
          <div key={a} className="flex items-center gap-2.5 text-[14px] text-on-surface-variant py-2">
            <span className="material-symbols-outlined text-[20px] text-primary [font-variation-settings:'FILL'_0,'wght'_300]">
              {AMENITY_ICONS[a] ?? AMENITY_ICONS[a.toLowerCase()] ?? 'check_circle'}
            </span>
            {a}
          </div>
        ))}
      </div>
    </div>
  );
}
