interface BookingFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filterOptions: { label: string; value: string }[];
}

export default function BookingFilterBar({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  filterOptions,
}: BookingFilterBarProps) {
  return (
    <section className="mb-8 flex flex-col md:flex-row gap-4 items-end justify-between">
      <div className="w-full md:w-96">
        <label className="font-label-md text-sm text-on-surface-variant mb-2 block">
          Search Order ID or Guest
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-secondary-container focus:border-primary transition-all text-sm outline-none"
            placeholder="e.g., EE-12940..."
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={`px-5 py-2.5 rounded-full font-semibold text-[13px] transition-all cursor-pointer border-none ${
              activeFilter === opt.value
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </section>
  );
}
