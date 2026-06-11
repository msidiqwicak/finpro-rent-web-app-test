import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

interface PricingCalendarProps {
  roomId: string;
  checkin: string;
  checkout: string;
  onChange: (checkin: string, checkout: string) => void;
}

interface DayPrice {
  date: string; // YYYY-MM-DD
  price: number;
  available: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function PricingCalendar({ roomId, checkin, checkout, onChange }: PricingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  const [prices, setPrices] = useState<Record<string, DayPrice>>({});
  const [loading, setLoading] = useState(false);

  // Fetch prices for the current month
  useEffect(() => {
    if (!roomId) return;
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const res = await api.get(`/properties/room-types/${roomId}/calendar?month=${year}-${month}`);
        
        // Convert array to a map for easy lookup
        const priceMap: Record<string, DayPrice> = {};
        if (res.data?.data) {
          res.data.data.forEach((item: any) => {
            priceMap[item.date] = item;
          });
        }
        setPrices(prev => ({ ...prev, ...priceMap }));
      } catch (error) {
        console.error("Failed to fetch calendar prices", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrices();
  }, [roomId, currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatShortPrice = (price: number) => {
    if (price >= 1000000) return `Rp ${(price / 1000000).toFixed(1).replace('.0', '')}jt`;
    if (price >= 1000) return `Rp ${Math.floor(price / 1000)}rb`;
    return `Rp ${price}`;
  };

  const handleDateClick = (dateStr: string) => {
    // Logic to select checkin/checkout
    if (!checkin) {
      onChange(dateStr, '');
    } else if (checkin && !checkout) {
      if (dateStr > checkin) {
        onChange(checkin, dateStr);
      } else {
        onChange(dateStr, ''); // Reset to new checkin
      }
    } else {
      onChange(dateStr, ''); // Reset
    }
  };

  // Generate calendar grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const grid = [];
  // Empty cells before the 1st
  for (let i = 0; i < firstDay; i++) {
    grid.push(<div key={`empty-${i}`} className="h-14"></div>);
  }
  
  // Date cells
  const todayStr = new Date().toISOString().split('T')[0];
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayData = prices[dateStr];
    
    const isPast = dateStr < todayStr;
    const isCheckin = dateStr === checkin;
    const isCheckout = dateStr === checkout;
    const isBetween = checkin && checkout && dateStr > checkin && dateStr < checkout;
    const isSelected = isCheckin || isCheckout;
    
    const isAvailable = !isPast && (!dayData || dayData.available !== false);

    grid.push(
      <button
        key={dateStr}
        disabled={!isAvailable}
        onClick={() => handleDateClick(dateStr)}
        className={`relative flex flex-col items-center justify-center h-14 border border-outline-variant/20 transition-colors
          ${isPast ? 'opacity-30 cursor-not-allowed bg-surface-low' : 'cursor-pointer hover:border-primary'}
          ${isSelected ? 'bg-primary text-on-primary font-bold' : ''}
          ${isBetween ? 'bg-primary/10 text-primary font-semibold' : ''}
          ${!isSelected && !isBetween && !isPast ? 'bg-white text-on-surface' : ''}
          ${isCheckin ? 'rounded-l-xl' : ''}
          ${isCheckout ? 'rounded-r-xl' : ''}
          ${!checkin && !checkout ? 'rounded-xl' : ''}
        `}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-1 w-full px-1">
            <div className="w-4 h-4 bg-outline-variant/30 animate-pulse rounded"></div>
            <div className="w-8 h-2 bg-outline-variant/20 animate-pulse rounded"></div>
          </div>
        ) : (
          <>
            <span className="text-[13px]">{i}</span>
            {dayData && (
              <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                {formatShortPrice(dayData.price)}
              </span>
            )}
          </>
        )}
      </button>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-outline-variant/40 shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePrevMonth} 
          disabled={currentDate <= new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-low disabled:opacity-30 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        <span className="font-display font-bold text-[16px]">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button 
          onClick={handleNextMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-low transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 relative">
        {grid}
      </div>
    </div>
  );
}
