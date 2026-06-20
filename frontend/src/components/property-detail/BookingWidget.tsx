import React from 'react';
import PricingCalendar from '../shared/PricingCalendar';
import type { RoomType } from './types';
import { formatPrice } from './utils';

interface BookingWidgetProps {
  selectedRoom: RoomType | null;
  checkin: string;
  checkout: string;
  guests: number;
  showCalendar: boolean;
  onSetCheckin: (val: string) => void;
  onSetCheckout: (val: string) => void;
  onSetGuests: (val: number) => void;
  onToggleCalendar: () => void;
  onCloseCalendar: () => void;
  onBookNow: () => void;
}

export default function BookingWidget({
  selectedRoom, checkin, checkout, guests, showCalendar,
  onSetCheckin, onSetCheckout, onSetGuests, onToggleCalendar, onCloseCalendar, onBookNow
}: BookingWidgetProps) {
  const nightCount = checkin && checkout
    ? Math.max(1, Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000))
    : 0;

  return (
    <div className="w-full lg:w-[380px] shrink-0">
      <div className="sticky top-[88px]">
        <div className="bg-surface-white rounded-2xl border border-outline-variant/40 shadow-[0_4px_24px_rgba(6,27,14,0.10)] p-6">
          {selectedRoom && (
            <div className="mb-5">
              <p className="font-display font-extrabold text-[26px] text-primary-container leading-tight">
                Rp {formatPrice(selectedRoom.adjusted_price)}
                <span className="text-[14px] font-normal text-on-surface-variant font-body"> / night</span>
              </p>
              <p className="text-[13px] text-on-surface-variant mt-1">{selectedRoom.name}</p>
            </div>
          )}

          <div 
            className="grid grid-cols-2 gap-0 mb-4 rounded-xl border border-outline-variant overflow-hidden cursor-pointer hover:bg-surface-low transition-colors"
            onClick={onToggleCalendar}
          >
            <div className="p-3 border-r border-outline-variant">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Check-in</label>
              <div className="text-[14px] font-semibold text-on-surface">
                {checkin ? new Date(checkin).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Add date'}
              </div>
            </div>
            <div className="p-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Check-out</label>
              <div className="text-[14px] font-semibold text-on-surface">
                {checkout ? new Date(checkout).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Add date'}
              </div>
            </div>
          </div>

          {showCalendar && selectedRoom && (
            <div className="mb-4">
              <PricingCalendar 
                roomId={selectedRoom.id}
                checkin={checkin}
                checkout={checkout}
                onChange={(ci, co) => {
                  onSetCheckin(ci);
                  onSetCheckout(co);
                  if (ci && co) onCloseCalendar();
                }}
              />
            </div>
          )}

          <div className="p-3 mb-4 rounded-xl border border-outline-variant">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Guests</label>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-on-surface">{guests} guest{guests > 1 ? 's' : ''}</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onSetGuests(Math.max(1, guests - 1))} disabled={guests <= 1}
                  className="w-8 h-8 rounded-full border border-outline-variant bg-transparent text-primary flex items-center justify-center cursor-pointer disabled:opacity-30">−</button>
                <button type="button" onClick={() => onSetGuests(Math.min(selectedRoom?.capacity ?? 10, guests + 1))} disabled={guests >= (selectedRoom?.capacity ?? 10)}
                  className="w-8 h-8 rounded-full border border-outline-variant bg-transparent text-primary flex items-center justify-center cursor-pointer disabled:opacity-30">+</button>
              </div>
            </div>
          </div>

          <button
            onClick={onBookNow}
            disabled={!selectedRoom || !checkin || !checkout}
            className="w-full py-4 rounded-xl bg-primary text-on-primary font-display font-bold text-[16px] border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {!checkin || !checkout ? 'Select dates to book' : 'Book Now'}
          </button>

          {selectedRoom && nightCount > 0 && (
            <div className="mt-5 pt-5 border-t border-outline-variant/50 space-y-2">
              <div className="flex justify-between text-[14px] text-on-surface-variant">
                <span>Rp {formatPrice(selectedRoom.adjusted_price)} × {nightCount} night{nightCount > 1 ? 's' : ''}</span>
                <span>Rp {formatPrice(selectedRoom.adjusted_price * nightCount)}</span>
              </div>
              <div className="flex justify-between text-[14px] text-on-surface-variant">
                <span>Service fee</span>
                <span>Rp {formatPrice(Math.round(selectedRoom.adjusted_price * nightCount * 0.05))}</span>
              </div>
              <div className="flex justify-between text-[16px] font-bold text-on-surface pt-3 border-t border-outline-variant/50">
                <span>Total</span>
                <span>Rp {formatPrice(Math.round(selectedRoom.adjusted_price * nightCount * 1.05))}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-white border-t border-outline-variant shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-5 py-3 flex items-center justify-between lg:hidden">
        <div>
          {selectedRoom && (
            <p className="font-display font-extrabold text-[18px] text-primary-container">
              Rp {formatPrice(selectedRoom.adjusted_price)}
              <span className="text-[12px] font-normal text-on-surface-variant font-body"> / night</span>
            </p>
          )}
        </div>
        <button
          onClick={onBookNow}
          disabled={!selectedRoom || !checkin || !checkout}
          className="px-8 py-3 rounded-xl bg-primary text-on-primary font-display font-bold text-[14px] border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
