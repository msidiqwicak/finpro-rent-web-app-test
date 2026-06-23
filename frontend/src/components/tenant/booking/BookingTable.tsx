import { Link } from "react-router-dom";
import BookingStatusBadge from "./BookingStatusBadge"; // Sesuaikan path

interface BookingTableProps {
  bookings: any[];
  isLoading: boolean;
  onConfirmClick: (booking: any) => void;
  onCancelClick: (booking: any) => void;
  onRemindClick: (id: string) => void;
  isProcessing: boolean;
}

export default function BookingTable({
  bookings,
  isLoading,
  onConfirmClick,
  onCancelClick,
  onRemindClick,
  isProcessing,
}: BookingTableProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(27,48,34,0.06)] border border-outline-variant/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                Order ID
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                Customer
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                Property
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                Check-in
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                Total Amount
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant">
                Status
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-on-surface-variant text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-on-surface-variant text-sm"
                >
                  <span className="material-symbols-outlined animate-spin text-primary text-2xl mb-2 block mx-auto">
                    autorenew
                  </span>
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-surface-container-lowest transition-colors ${item.status === "CANCELED" ? "opacity-70" : ""}`}
                >
                  <td className="py-3 px-4">
                    <span className="text-sm text-primary font-bold">
                      #{item.id.substring(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">
                        {item.users?.name || "Tamu"}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {item.users?.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-on-surface">
                    {item.room_unit?.room_type?.property?.name || "Property"}
                  </td>
                  <td className="py-3 px-4 text-sm text-on-surface">
                    {new Date(item.check_in).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-sm font-bold text-on-surface">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(Number(item.total_price))}
                  </td>
                  <td className="py-3 px-4">
                    <BookingStatusBadge status={item.status} />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === "WAITING_FOR_CONFIRMATION" && (
                        <button
                          onClick={() => onConfirmClick(item)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-[13px] hover:shadow-lg transition-all cursor-pointer border-none"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            visibility
                          </span>
                          Receipt
                        </button>
                      )}
                      {item.status === "WAITING_FOR_PAYMENT" && (
                        <button
                          onClick={() => onCancelClick(item)}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-error text-error bg-transparent rounded-lg font-semibold text-[13px] hover:bg-error/5 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            cancel
                          </span>
                          Cancel
                        </button>
                      )}
                      {item.status === "CONFIRMED" && (
                        <button
                          disabled={isProcessing}
                          onClick={() => onRemindClick(item.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-semibold text-[13px] hover:shadow-lg transition-all cursor-pointer border-none disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            forward_to_inbox
                          </span>
                          Remind
                        </button>
                      )}
                      <Link
                        to={`/tenant/bookings/${item.id}`}
                        state={{ status: item.status }}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          open_in_new
                        </span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-on-surface-variant text-sm"
                >
                  No bookings found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-surface-container-lowest flex items-center justify-between">
        <p className="text-xs font-medium text-on-surface-variant">
          Showing {bookings.length} transactions
        </p>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg border border-outline-variant cursor-pointer disabled:opacity-50">
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
          </button>
          <button className="p-2 rounded-lg border border-outline-variant cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
