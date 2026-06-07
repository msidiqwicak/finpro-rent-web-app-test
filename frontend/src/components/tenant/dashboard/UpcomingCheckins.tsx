interface Props {
  onViewAllActivity: () => void;
}

export default function UpcomingCheckins({ onViewAllActivity }: Props) {
  return (
    <div className="p-8 bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant">
      <h4 className="text-xl font-bold text-primary mb-6">
        Upcoming Check-ins
      </h4>
      <div className="space-y-4">
        {[
          {
            name: "Michael Chen",
            prop: "Forest Pine Retreat",
            date: "Tomorrow",
            time: "2:00 PM",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
            bg: "bg-secondary-fixed",
          },
          {
            name: "Elena Rodriguez",
            prop: "Sage Lake Cottage",
            date: "June 24",
            time: "3:00 PM",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
            bg: "bg-primary-fixed",
          },
          {
            name: "Jameson Blake",
            prop: "Moss Ridge Villa",
            date: "June 26",
            time: "11:00 AM",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jameson",
            bg: "bg-tertiary-fixed",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container-low transition-all cursor-pointer border border-transparent hover:border-outline-variant"
          >
            <div
              className={`w-12 h-12 rounded-full overflow-hidden shrink-0 ${item.bg}`}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <p className="text-on-surface font-bold text-sm">
                {item.name}
              </p>
              <p className="text-on-surface-variant text-xs">
                {item.prop}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`font-bold text-sm ${
                  item.date === "Tomorrow"
                    ? "text-primary"
                    : "text-on-surface"
                }`}
              >
                {item.date}
              </p>
              <p className="text-on-surface-variant text-xs">
                {item.time}
              </p>
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
