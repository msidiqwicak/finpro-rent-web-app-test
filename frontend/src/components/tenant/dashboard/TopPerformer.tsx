import type { DashboardStats } from "../../../pages/tenant/Dashboard";

interface Props {
  property?: DashboardStats["topProperty"];
}

export default function TopPerformer({ property }: Props) {
  if (!property) return null;

  const formatRp = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="lg:col-span-1">
      <div className="relative group overflow-hidden bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant flex flex-col h-full">
        <div className="h-48 overflow-hidden">
          <img
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src={property.image}
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h5 className="text-lg font-bold text-primary truncate max-w-[70%]">
              {property.name}
            </h5>
            {property.ecoFriendly && (
              <div className="px-3 py-1 rounded-full inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold shrink-0">
                <span className="material-symbols-outlined text-[14px]">
                  eco
                </span>
                Solar
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">
              location_on
            </span>
            <span className="text-sm truncate">{property.location}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-6">
            <div>
              <p className="text-on-surface-variant text-xs font-bold mb-1 uppercase tracking-wider">
                Earnings (Mo)
              </p>
              <p className="text-secondary font-bold">
                {formatRp(property.earnings)}
              </p>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-bold mb-1 uppercase tracking-wider">
                Total Bookings
              </p>
              <p className="text-primary font-bold">{property.occupancy}x</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
