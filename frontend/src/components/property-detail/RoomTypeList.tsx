
import type { RoomType } from './types';
import { formatPrice, PLACEHOLDER } from './utils';

interface RoomTypeListProps {
  roomTypes: RoomType[];
  selectedRoom: RoomType | null;
  onSelectRoom: (room: RoomType) => void;
}

export default function RoomTypeList({ roomTypes, selectedRoom, onSelectRoom }: RoomTypeListProps) {
  if (!roomTypes || roomTypes.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="font-display font-bold text-[20px] text-on-surface mb-4">Available Room Types</h2>
      <div className="flex flex-col gap-4">
        {roomTypes.map((rt) => (
          <button
            key={rt.id}
            onClick={() => onSelectRoom(rt)}
            className={`flex gap-4 p-4 rounded-xl border-2 text-left bg-transparent cursor-pointer transition-all ${
              selectedRoom?.id === rt.id
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-outline-variant/40 hover:border-primary/50'
            }`}
          >
            <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
              <img src={rt.image_urls[0] ?? PLACEHOLDER} alt={rt.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-[16px] text-on-surface mb-1">{rt.name}</p>
              <p className="text-[13px] text-on-surface-variant mb-2">
                Up to {rt.capacity} guest{rt.capacity > 1 ? 's' : ''} · {rt.total_units} unit{rt.total_units > 1 ? 's' : ''}
              </p>
              <p className="font-display font-extrabold text-[18px] text-primary-container">
                Rp {formatPrice(rt.adjusted_price)}
                <span className="text-[13px] font-normal text-on-surface-variant font-body"> / night</span>
              </p>
            </div>
            {selectedRoom?.id === rt.id && (
              <span className="material-symbols-outlined text-primary text-[24px] self-center [font-variation-settings:'FILL'_1]">check_circle</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
