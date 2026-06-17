import React from "react";

interface PropertySelectorBarProps {
  calendarData: any[];
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
}

export default function PropertySelectorBar({
  calendarData,
  selectedPropertyId,
  setSelectedPropertyId,
}: PropertySelectorBarProps) {
  return (
    <div className="w-full bg-white/80 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 md:px-8 lg:px-16 py-4 sticky top-0 z-30 backdrop-blur-md gap-4">
      <div className="flex items-center gap-6">
        <h2 className="font-display text-lg md:text-xl font-bold text-primary">
          Property & Room Availability
        </h2>
      </div>
      <div className="flex items-center bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant/30 w-full sm:w-auto">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-2 shrink-0">
          location_on
        </span>
        <select
          value={selectedPropertyId}
          onChange={(e) => setSelectedPropertyId(e.target.value)}
          className="bg-transparent border-none focus:ring-0 text-sm font-bold text-on-surface cursor-pointer p-0 pr-8 outline-none w-full truncate"
        >
          {calendarData.map((prop) => (
            <option key={prop.property_id} value={prop.property_id}>
              {prop.property_name}
            </option>
          ))}
          {calendarData.length === 0 && <option>No property found</option>}
        </select>
      </div>
    </div>
  );
}
