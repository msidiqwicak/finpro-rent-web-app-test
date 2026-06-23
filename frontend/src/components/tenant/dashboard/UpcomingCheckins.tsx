
import { getImageUrl } from '../../../utils/imageUrl';
import type { DashboardStats } from "../../../pages/tenant/Dashboard";

interface Props {
  checkins?: DashboardStats["upcomingCheckins"];
  onViewAllActivity: () => void;
}

export default function UpcomingCheckins({
  checkins,
  onViewAllActivity,
}: Props) {
  if (!checkins) return null;

  return (
    <div className="p-8 bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant">
      <h4 className="text-xl font-bold text-primary mb-6">
        Upcoming Check-ins
      </h4>
      <div className="space-y-4">
        {checkins.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container-low transition-all cursor-pointer border border-transparent hover:border-outline-variant"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-on-surface font-bold text-lg overflow-hidden ${item.bg}`}
            >
              {item.img ? (
                <img
                  src={getImageUrl(item.img)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = "block";
                    }
                  }}
                />
              ) : null}
              {/* Fallback icon if image fails or is missing */}
              <span 
                className="material-symbols-outlined text-[24px]" 
                style={{ display: item.img ? "none" : "block" }}
              >
                person
              </span>
            </div>
            <div className="flex-grow">
              <p className="text-on-surface font-bold text-sm">{item.name}</p>
              <p className="text-on-surface-variant text-xs">{item.property}</p>
            </div>
            <div className="text-right">
              <p
                className={`font-bold text-sm ${item.date === "Tomorrow" ? "text-primary" : "text-on-surface"}`}
              >
                {item.date}
              </p>
              <p className="text-on-surface-variant text-xs">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onViewAllActivity}
        className="w-full mt-6 py-3 text-secondary font-bold text-sm hover:bg-surface-container-low rounded-xl transition-all cursor-pointer border-none"
      >
        View All Activity
      </button>
    </div>
  );
}