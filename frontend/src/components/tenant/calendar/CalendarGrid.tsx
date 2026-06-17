import React from "react";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface CalendarGridProps {
  currentDate: Date;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  isLoading: boolean;
  calendarDays: (number | null)[];
  getDayStatus: (day: number) => {
    bookedUnits: string[];
    totalAvailable: number;
    totalUnits: number;
  };
}

export default function CalendarGrid({
  currentDate,
  handlePrevMonth,
  handleNextMonth,
  isLoading,
  calendarDays,
  getDayStatus,
}: CalendarGridProps) {
  return (
    <section className="flex-1 flex flex-col gap-4 md:gap-6 w-full">
      {/* Controls & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
          <h3 className="font-headline-sm text-lg md:text-2xl font-bold text-primary">
            {currentDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/20 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1 md:p-1.5 hover:bg-white rounded-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px] md:text-[20px] flex">
                chevron_left
              </span>
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 md:p-1.5 hover:bg-white rounded-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px] md:text-[20px] flex">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        <button className="hidden sm:block bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-sm">
          Export
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 py-3 px-4 md:px-5 bg-surface-container-low rounded-xl border border-outline-variant/20 shadow-sm text-[10px] md:text-xs font-bold">
        <span className="text-on-surface-variant uppercase tracking-wider hidden md:block">
          Status Legend:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#d0e9d4]"></span>
          <span className="text-on-surface-variant">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-secondary-container"></span>
          <span className="text-on-surface-variant">Occupied</span>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[450px] md:min-h-[600px]">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-surface-container-low border-b border-outline-variant/20">
          {DAYS.map((day) => (
            <div
              key={day}
              className="p-2 md:p-3 text-center text-[9px] md:text-xs font-bold text-on-surface-variant tracking-wider"
            >
              {/* Singkat nama hari di layar kecil */}
              <span className="md:hidden">{day.charAt(0)}</span>
              <span className="hidden md:inline">{day}</span>
            </div>
          ))}
        </div>

        {/* Days Body */}
        <div className="grid grid-cols-7 flex-1">
          {isLoading ? (
            <div className="col-span-7 flex justify-center items-center h-64 md:h-96">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            calendarDays.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`blank-${idx}`}
                    className="border-r border-b border-outline-variant/10 p-1 md:p-2 min-h-[70px] md:min-h-[110px] bg-surface-container-low/20 opacity-40"
                  ></div>
                );
              }

              const { bookedUnits, totalAvailable, totalUnits } =
                getDayStatus(day);
              const isFullHouse = totalUnits > 0 && totalAvailable === 0;

              return (
                <div
                  key={`day-${day}`}
                  className={`border-r border-b border-outline-variant/10 p-1 md:p-2 min-h-[70px] md:min-h-[110px] hover:bg-surface-container-low/20 transition-all flex flex-col justify-between group cursor-pointer overflow-hidden
                    ${isFullHouse ? "bg-secondary-container/5" : ""}
                  `}
                >
                  <span className="text-xs md:text-sm font-bold text-on-surface-variant w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full group-hover:bg-primary/5">
                    {day}
                  </span>

                  <div className="mt-1 md:mt-2 space-y-1 w-full flex flex-col">
                    {/* Tampilkan 1 kamar di Mobile, 2 di Desktop */}
                    {bookedUnits
                      .slice(0, window.innerWidth < 768 ? 1 : 2)
                      .map((unitStr, uIdx) => (
                        <div
                          key={uIdx}
                          className="bg-secondary-container/80 text-[8px] md:text-[10px] px-1 md:px-2 py-0.5 rounded text-on-secondary-container font-bold truncate flex items-center justify-between"
                        >
                          <span className="truncate">{unitStr}</span>
                          <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-secondary shrink-0 ml-1"></span>
                        </div>
                      ))}
                    {bookedUnits.length > (window.innerWidth < 768 ? 1 : 2) && (
                      <div className="text-[7px] md:text-[9px] text-secondary font-bold pl-1">
                        +
                        {bookedUnits.length - (window.innerWidth < 768 ? 1 : 2)}
                      </div>
                    )}

                    {/* Unit Tersedia */}
                    {totalUnits > 0 && (
                      <div
                        className={`text-[8px] md:text-[10px] px-1 md:px-2 py-0.5 rounded font-bold mt-auto truncate ${
                          isFullHouse
                            ? "bg-secondary text-white text-center uppercase"
                            : "bg-[#d0e9d4] text-primary"
                        }`}
                      >
                        {isFullHouse ? "Full" : `${totalAvailable} Avail`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Export button moved to bottom for mobile */}
      <button className="sm:hidden w-full bg-primary text-on-primary px-6 py-3 rounded-xl text-sm font-bold shadow-sm">
        Export Report
      </button>
    </section>
  );
}
