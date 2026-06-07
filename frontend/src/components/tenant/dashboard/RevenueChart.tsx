export default function RevenueChart() {
  return (
    <div className="lg:col-span-2 p-8 bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-bold text-primary">
            Revenue Overview
          </h4>
          <p className="text-on-surface-variant text-sm">
            Monthly earnings for the past 6 months
          </p>
        </div>
        <select className="bg-surface-container-low border-none rounded-full px-4 py-2 font-label-md text-sm text-on-surface focus:ring-secondary outline-none cursor-pointer">
          <option>Last 6 Months</option>
          <option>Year to Date</option>
        </select>
      </div>
      <div className="h-64 flex items-end justify-between gap-4 px-2">
        {/* Dummy Bar Charts */}
        {[
          { month: "Jan", height: "40%", label: "Rp 4.2M" },
          { month: "Feb", height: "55%", label: "Rp 5.1M" },
          { month: "Mar", height: "45%", label: "Rp 4.8M" },
          { month: "Apr", height: "75%", label: "Rp 7.5M" },
          { month: "May", height: "85%", label: "Rp 8.2M" },
          { month: "Jun", height: "95%", label: "Rp 9.8M", active: true },
        ].map((data, idx) => (
          <div
            key={idx}
            className="flex-1 group flex flex-col items-center gap-3"
          >
            <div
              className={`w-full rounded-t-xl relative transition-colors ${
                data.active
                  ? "bg-primary-container group-hover:bg-primary"
                  : "bg-surface-container-high group-hover:bg-secondary-container"
              }`}
              style={{ height: data.height }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {data.label}
              </div>
            </div>
            <span
              className={`text-xs ${
                data.active
                  ? "text-primary font-bold"
                  : "text-on-surface-variant"
              }`}
            >
              {data.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
