
type GroupBy = "transaction" | "property" | "user";

interface Props {
  reportData: any[];
  isLoading: boolean;
  groupBy: GroupBy;
  setGroupBy: (val: GroupBy) => void;
  sortBy: "date" | "total";
  sortOrder: "asc" | "desc";
  toggleSort: (col: "date" | "total") => void;
  formatCurrency: (val: number) => string;
}

export default function SalesDataTable({
  reportData,
  isLoading,
  groupBy,
  setGroupBy,
  sortBy,
  sortOrder,
  toggleSort,
  formatCurrency,
}: Props) {
  const getSortIcon = (col: string) =>
    sortBy === col
      ? sortOrder === "desc"
        ? "arrow_downward"
        : "arrow_upward"
      : "unfold_more";
  const nameLabel =
    groupBy === "transaction"
      ? "Property & User"
      : groupBy === "property"
        ? "Property Name"
        : "User Name";

  return (
    <section className="bg-white rounded-2xl md:rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <div className="p-4 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-outline-variant/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <h4 className="font-headline-sm text-xl font-bold text-primary">
            Data Table
          </h4>
          <div className="flex flex-wrap items-center gap-1 md:gap-2 p-1 bg-surface-container rounded-xl w-full sm:w-auto">
            {(["transaction", "property", "user"] as GroupBy[]).map((type) => (
              <button
                key={type}
                onClick={() => setGroupBy(type)}
                className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold capitalize transition-all ${groupBy === type ? "bg-white shadow-sm text-on-surface" : "text-on-surface-variant hover:bg-white/50"}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th
                  onClick={() => toggleSort("date")}
                  className="px-4 md:px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:text-primary"
                >
                  <div className="flex items-center gap-2">
                    {groupBy === "transaction" ? "Date" : "Latest Date"}{" "}
                    <span className="material-symbols-outlined text-sm">
                      {getSortIcon("date")}
                    </span>
                  </div>
                </th>
                <th className="px-4 md:px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  {nameLabel}
                </th>
                {groupBy !== "transaction" && (
                  <th className="px-4 md:px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Total Bookings
                  </th>
                )}
                <th
                  onClick={() => toggleSort("total")}
                  className="px-4 md:px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:text-primary"
                >
                  <div className="flex items-center justify-end gap-2">
                    Total Sales{" "}
                    <span className="material-symbols-outlined text-sm">
                      {getSortIcon("total")}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {reportData.length > 0 ? (
                reportData.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className="hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="px-4 md:px-8 py-4 text-sm md:text-base text-on-surface">
                      {new Date(row.date).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 md:px-8 py-4">
                      <div className="font-bold text-on-surface text-sm md:text-base">
                        {groupBy === "property"
                          ? row.property_name
                          : groupBy === "user"
                            ? row.user_name
                            : row.property_name}
                      </div>
                      {groupBy === "transaction" && (
                        <div className="text-xs md:text-sm text-on-surface-variant">
                          {row.user_name}
                        </div>
                      )}
                      {groupBy === "user" && (
                        <div className="text-xs md:text-sm text-on-surface-variant">
                          {row.user_email}
                        </div>
                      )}
                    </td>
                    {groupBy !== "transaction" && (
                      <td className="px-4 md:px-8 py-4 text-on-surface-variant font-bold text-sm md:text-base">
                        {row.total_transactions} trx
                      </td>
                    )}
                    <td className="px-4 md:px-8 py-4 text-right font-bold text-primary text-sm md:text-base">
                      {formatCurrency(row.total_sales)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 text-on-surface-variant text-sm"
                  >
                    Tidak ada data penjualan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
