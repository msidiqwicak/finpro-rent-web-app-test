import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ── Constants ─────────────────────────────────────────────────
const CITIES = ['Bali', 'Bandung', 'Yogyakarta', 'Lombok', 'Raja Ampat', 'Labuan Bajo', 'Flores', 'Manado', 'Nusa Penida'];
const NIGHTS = [1, 2, 3, 4, 5, 6, 7, 10, 14];
const today  = new Date().toISOString().split('T')[0];
const INPUT_CLS = 'w-full border-none bg-transparent font-body text-[15px] font-semibold text-on-surface outline-none cursor-pointer';
const LABEL_CLS = 'block text-[11px] font-bold tracking-[0.08em] uppercase text-on-surface-variant mb-1';

// ── Guest Counter ─────────────────────────────────────────────
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

// ── Compact Pill ──────────────────────────────────────────────
function CompactPill({ onClick, search, city }: { onClick: () => void; search: string; city: string }) {
  const summary = [search, city].filter(Boolean).join(' · ') || 'Search destination, dates...';
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full max-w-[480px] flex items-center gap-3 bg-surface-white rounded-full shadow-[0_4px_20px_rgba(6,27,14,0.12)] hover:shadow-[0_6px_24px_rgba(6,27,14,0.18)] px-5 py-3 border border-outline-variant/30 cursor-pointer transition-shadow duration-300 active:scale-[0.98]"
    >
      <span className="material-symbols-outlined text-[20px] text-primary">search</span>
      <span className="flex-1 text-left text-[14px] text-on-surface-variant font-medium truncate">{summary}</span>
      <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[16px] text-on-primary">tune</span>
      </span>
    </button>
  );
}

// ── Full Search Form ──────────────────────────────────────────
interface FormProps {
  search: string; setSearch: (v: string) => void;
  city: string;   setCity: (v: string) => void;
  checkin: string; setCheckin: (v: string) => void;
  nights: string;  setNights: (v: string) => void;
  guests: number;  setGuests: (v: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose?: () => void;
}

function FullSearchForm({ search, setSearch, city, setCity, checkin, setCheckin, nights, setNights, guests, setGuests, onSubmit, onClose }: FormProps) {
  return (
    <div className="w-full bg-surface-white rounded-2xl shadow-[0_8px_32px_rgba(6,27,14,0.18)] overflow-hidden border border-outline-variant/30">
      {onClose && (
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <span className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Search</span>
          <button type="button" onClick={onClose} aria-label="Close search"
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center border-none cursor-pointer text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
      <form className="flex flex-col sm:flex-row" onSubmit={onSubmit}>
        <div className="flex-1 px-5 py-3.5 border-b border-outline-variant sm:border-b-0 sm:border-r min-w-0">
          <label className={LABEL_CLS} htmlFor="sw-search">Search</label>
          <input id="sw-search" type="text" placeholder="Property name…" value={search}
            onChange={(e) => setSearch(e.target.value)} className={`${INPUT_CLS} cursor-text`} />
        </div>
        <div className="flex-1 px-5 py-3.5 border-b border-outline-variant sm:border-b-0 sm:border-r min-w-0">
          <label className={LABEL_CLS} htmlFor="sw-location">Location</label>
          <select id="sw-location" className={INPUT_CLS} value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1 px-5 py-3.5 border-b border-outline-variant sm:border-b-0 sm:border-r min-w-0">
          <label className={LABEL_CLS} htmlFor="sw-checkin">Dates</label>
          <input id="sw-checkin" type="date" className={INPUT_CLS} min={today} value={checkin}
            onChange={(e) => setCheckin(e.target.value)} />
        </div>
        <div className="flex-1 px-5 py-3.5 border-b border-outline-variant sm:border-b-0 sm:border-r min-w-0">
          <label className={LABEL_CLS} htmlFor="sw-nights">Nights</label>
          <select id="sw-nights" className={INPUT_CLS} value={nights} onChange={(e) => setNights(e.target.value)}>
            <option value="">Duration</option>
            {NIGHTS.map(n => <option key={n} value={n}>{n} night{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div className="flex-1 px-5 py-3.5 border-b border-outline-variant sm:border-b-0 sm:border-r min-w-0">
          <span className={LABEL_CLS}>Guests</span>
          <GuestCounter guests={guests} setGuests={setGuests} />
        </div>
        <button type="submit" aria-label="Search properties"
          className="px-7 py-4 bg-primary text-on-primary font-display font-bold text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer border-none">
          <span className="material-symbols-outlined text-[22px]">search</span>
        </button>
      </form>
    </div>
  );
}
interface SearchWidgetProps {
  scrollThreshold?: number;
}

export default function SearchWidget({ scrollThreshold = 350 }: SearchWidgetProps) {
  const navigate = useNavigate();
  const [searchParams]            = useSearchParams();
  const [search, setSearch]       = useState(searchParams.get('search') ?? '');
  const [city, setCity]           = useState(searchParams.get('city') ?? '');
  const [checkin, setCheckin]     = useState(searchParams.get('checkin') ?? '');
  const [nights, setNights]       = useState(searchParams.get('nights') ?? '');
  const [guests, setGuests]       = useState(Number(searchParams.get('guests')) || 1);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (city)          params.set('city', city);
    if (checkin)       params.set('checkin', checkin);
    if (nights)        params.set('nights', nights);
    if (guests > 1)    params.set('guests', String(guests));
    navigate(`/explore?${params.toString()}`);
    setIsExpanded(false);
  };

  return (
    <>
      <div className="relative w-full flex justify-center min-h-[56px] sm:min-h-[76px] lg:min-h-[82px] items-center">

        <div className="w-full flex justify-center sm:hidden">
          <CompactPill onClick={() => setIsExpanded(true)} search={search} city={city} />
        </div>
        <div className="hidden sm:block w-full">
          <div 
            className={`absolute inset-0 flex justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isScrolled 
                ? 'opacity-100 translate-y-0 scale-100 z-10' 
                : 'opacity-0 -translate-y-4 scale-95 pointer-events-none -z-10'
            }`}
          >
            <CompactPill onClick={() => setIsExpanded(true)} search={search} city={city} />
          </div>

          <div 
            className={`absolute inset-0 w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              !isScrolled 
                ? 'opacity-100 translate-y-0 scale-100 z-10' 
                : 'opacity-0 translate-y-4 scale-[0.98] pointer-events-none -z-10'
            }`}
          >
            <FullSearchForm
              search={search} setSearch={setSearch}
              city={city} setCity={setCity}
              checkin={checkin} setCheckin={setCheckin}
              nights={nights} setNights={setNights}
              guests={guests} setGuests={setGuests}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

      </div>
      {isExpanded && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-[45] backdrop-blur-[2px] transition-opacity animate-fade-in"
            onClick={() => setIsExpanded(false)}
          />
          <div className="fixed left-1/2 -translate-x-1/2 top-[80px] z-[46] w-[calc(100%-40px)] max-w-[1000px] animate-[slideDown_0.2s_ease-out]">
            <FullSearchForm
              search={search} setSearch={setSearch}
              city={city} setCity={setCity}
              checkin={checkin} setCheckin={setCheckin}
              nights={nights} setNights={setNights}
              guests={guests} setGuests={setGuests}
              onSubmit={handleSubmit}
              onClose={() => setIsExpanded(false)}
            />
          </div>
        </>
      )}
    </>
  );
}
