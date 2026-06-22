
interface OrderFilterBarProps {
  activeTab: "ongoing" | "completed";
  setActiveTab: (tab: "ongoing" | "completed") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateQuery: string;
  setDateQuery: (date: string) => void;
}

export default function OrderFilterBar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  dateQuery,
  setDateQuery,
}: OrderFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 w-full">
      {/* Tabs Filter */}
      <div className="flex p-1 bg-surface-low rounded-lg w-full lg:w-auto border border-outline-variant shadow-sm">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`flex-1 lg:flex-none px-6 py-2.5 font-bold text-sm rounded-md transition-all ${
            activeTab === "ongoing"
              ? "bg-surface-white text-primary shadow-sm"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          Ongoing
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 lg:flex-none px-6 py-2.5 font-bold text-sm rounded-md transition-all ${
            activeTab === "completed"
              ? "bg-surface-white text-primary shadow-sm"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Container Group untuk Input Pencarian */}
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        {/* 1. Filter Berdasarkan No Order */}
        <div className="flex flex-col gap-2 flex-grow sm:w-64">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
            Order Number
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-surface-white border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-surface-low"
              >
                close
              </button>
            )}
          </div>
        </div>

        {/* 2. Filter Berdasarkan Tanggal */}
        <div className="flex flex-col gap-2 flex-grow sm:w-56">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
            Check-in Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateQuery}
              onChange={(e) => setDateQuery(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 bg-surface-white border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {dateQuery && (
              <button
                onClick={() => setDateQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-surface-low"
              >
                close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
