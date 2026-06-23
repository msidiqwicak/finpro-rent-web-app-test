interface Props {
  startDate: string;
  endDate: string;
  setStartDate: (d: string) => void;
  setEndDate: (d: string) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

export default function DateRangePickerPopover({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  isOpen,
  setIsOpen,
}: Props) {
  const formatStr = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";
  const rangeLabel =
    !startDate && !endDate
      ? "Date"
      : `${formatStr(startDate) || "Awal"} - ${formatStr(endDate) || "Sekarang"}`;

  const inputs = [
    { label: "Start Date", val: startDate, setter: setStartDate },
    { label: "End Date", val: endDate, setter: setEndDate },
  ];

  return (
    <div className="relative group w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-auto gap-3 px-5 py-3 bg-white border border-outline-variant/50 rounded-xl shadow-sm hover:border-secondary transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">
            calendar_today
          </span>
          <span className="text-on-surface text-sm font-bold min-w-[150px] text-left">
            {rangeLabel}
          </span>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[calc(100vw-3rem)] sm:w-80 bg-white rounded-xl shadow-xl border border-outline-variant/30 z-50 p-5 animate-fade-in">
          <div className="flex flex-col gap-4">
            {inputs.map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  {field.label}
                </label>
                <input
                  type="date"
                  value={field.val}
                  onChange={(e) => field.setter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none text-sm text-on-surface"
                />
              </div>
            ))}
            <div className="flex justify-between items-center mt-2 border-t border-outline-variant/30 pt-4">
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setIsOpen(false);
                }}
                className="text-xs font-bold text-error hover:bg-error-container/20 px-3 py-2 rounded-lg transition-colors"
              >
                Clear Filter
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold bg-primary text-on-primary px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
