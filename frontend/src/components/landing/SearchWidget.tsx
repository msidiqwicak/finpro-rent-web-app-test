import { useState } from 'react';

const CITIES = ['Bali', 'Bandung', 'Yogyakarta', 'Lombok', 'Raja Ampat', 'Labuan Bajo', 'Flores', 'Manado', 'Nusa Penida'];
const NIGHTS = [1, 2, 3, 4, 5, 6, 7, 10, 14];
const today  = new Date().toISOString().split('T')[0];

const INPUT_CLS = 'w-full border-none bg-transparent font-body text-[15px] font-semibold text-on-surface outline-none cursor-pointer';
const LABEL_CLS = 'block text-[11px] font-bold tracking-[0.08em] uppercase text-on-surface-variant mb-1';

function GuestCounter({ guests, setGuests }: { guests: number; setGuests: (n: number) => void }) {
  const btnCls = 'w-7 h-7 rounded-full border-[1.5px] border-outline-variant bg-transparent text-primary text-base flex items-center justify-center transition-all cursor-pointer';
  return (
    <div className="flex items-center gap-2.5 mt-1">
      <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1}
        aria-label="Decrease guests" className={`${btnCls} ${guests <= 1 ? 'opacity-35 cursor-not-allowed' : ''}`}>−</button>
      <span className="text-[15px] font-bold text-on-surface min-w-[20px] text-center">{guests}</span>
      <button type="button" onClick={() => setGuests(Math.min(20, guests + 1))} disabled={guests >= 20}
        aria-label="Increase guests" className={`${btnCls} ${guests >= 20 ? 'opacity-35 cursor-not-allowed' : ''}`}>+</button>
    </div>
  );
}

export default function SearchWidget() {
  const [guests, setGuests] = useState(1);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };

  return (
    <div className="w-full max-w-[880px] bg-surface-white rounded-2xl shadow-[0_8px_32px_rgba(6,27,14,0.18)] overflow-hidden border border-outline-variant/30">
      <form className="flex flex-col sm:flex-row" onSubmit={handleSubmit}>

        <div className="flex-1 px-5 py-3.5 border-b border-outline-variant sm:border-b-0 sm:border-r min-w-0">
          <label className={LABEL_CLS} htmlFor="sw-location">Location</label>
          <select id="sw-location" className={INPUT_CLS} defaultValue="">
            <option value="" disabled>Where to?</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex-1 px-5 py-3.5 border-b border-outline-variant sm:border-b-0 sm:border-r min-w-0">
          <label className={LABEL_CLS} htmlFor="sw-checkin">Dates</label>
          <input id="sw-checkin" type="date" className={INPUT_CLS} min={today} />
        </div>

        <div className="flex-1 px-5 py-3.5 border-b border-outline-variant sm:border-b-0 sm:border-r min-w-0">
          <label className={LABEL_CLS} htmlFor="sw-nights">Nights</label>
          <select id="sw-nights" className={INPUT_CLS} defaultValue="">
            <option value="" disabled>Duration</option>
            {NIGHTS.map(n => <option key={n} value={n}>{n} night{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>

        <div className="flex-1 px-5 py-3.5 border-b border-outline-variant sm:border-b-0 sm:border-r min-w-0">
          <span className={LABEL_CLS}>Guests</span>
          <GuestCounter guests={guests} setGuests={setGuests} />
        </div>

        <button type="submit" aria-label="Search properties"
          className="px-7 py-4 bg-primary text-on-primary font-display font-bold text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer border-none"
        >
          <span className="material-symbols-outlined text-[22px]">search</span>
        </button>
      </form>
    </div>
  );
}
