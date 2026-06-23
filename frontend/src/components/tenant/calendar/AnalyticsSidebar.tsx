
interface AnalyticsSidebarProps {
  metrics: {
    totalUnits: number;
    occupiedUnits: number;
    occupancyRate: number;
    arrivals: any[];
  };
}

export default function AnalyticsSidebar({ metrics }: AnalyticsSidebarProps) {
  return (
    <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
      {/* Bento Widget 1: Occupancy Pulse Card */}
      <div className="bg-primary-container p-5 md:p-6 rounded-3xl text-on-primary shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display font-bold text-lg">Today's Pulse</h4>
          <span className="material-symbols-outlined text-[22px]">
            analytics
          </span>
        </div>
        <div className="mb-6">
          <p className="text-[10px] md:text-xs opacity-75 uppercase tracking-widest font-bold mb-1">
            Current Occupancy
          </p>
          <div className="flex items-end gap-2">
            <span className="text-4xl md:text-5xl font-black leading-none">
              {metrics.occupancyRate}%
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary-fixed transition-all duration-500"
              style={{ width: `${metrics.occupancyRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] md:text-xs font-bold opacity-90">
            <span>{metrics.occupiedUnits} Rooms Occupied</span>
            <span>{metrics.totalUnits} Total Units</span>
          </div>
        </div>
      </div>

      {/* Bento Widget 2: Upcoming Arrivals list */}
      <div className="bg-surface-container-low p-5 md:p-6 rounded-2xl border border-outline-variant/20 flex-1 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-xs md:text-sm font-bold text-primary uppercase tracking-wider">
            Upcoming Arrivals
          </h4>
          <span className="bg-[#d0e9d4] text-primary px-2.5 py-0.5 rounded text-[10px] md:text-xs font-bold">
            {metrics.arrivals.length} Today
          </span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto max-h-[250px] md:max-h-[300px] pr-1 custom-scrollbar">
          {metrics.arrivals.map((arrival) => (
            <div
              key={arrival.id}
              className="p-3 bg-white rounded-xl border border-outline-variant/30 flex items-center gap-3 hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs shrink-0">
                {arrival.guest_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-bold text-on-surface truncate">
                  {arrival.guest_name}
                </p>
                <p className="text-[10px] md:text-xs text-on-surface-variant truncate">
                  {arrival.unit_info}
                </p>
              </div>
              <span className="material-symbols-outlined text-secondary text-[18px]">
                arrow_forward
              </span>
            </div>
          ))}

          {metrics.arrivals.length === 0 && (
            <div className="text-center py-10 md:py-12 text-[10px] md:text-xs text-on-surface-variant opacity-70 italic border border-dashed border-outline-variant rounded-xl bg-white/50">
              No check-ins schedule for today.
            </div>
          )}
        </div>
      </div>

      {/* Quick Info Box Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col">
          <span className="material-symbols-outlined text-primary mb-2 text-[20px] md:text-[24px]">
            cleaning_services
          </span>
          <p className="text-[9px] md:text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
            Active Rooms
          </p>
          <p className="text-2xl md:text-3xl font-black text-primary mt-1">
            {metrics.totalUnits}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col">
          <span className="material-symbols-outlined text-secondary mb-2 text-[20px] md:text-[24px]">
            bed
          </span>
          <p className="text-[9px] md:text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
            Occupied
          </p>
          <p className="text-2xl md:text-3xl font-black text-primary mt-1">
            {metrics.occupiedUnits}
          </p>
        </div>
      </div>
    </aside>
  );
}
