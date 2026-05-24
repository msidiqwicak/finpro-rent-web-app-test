import { useState } from 'react';

const CITIES  = ['Bali', 'Bandung', 'Yogyakarta', 'Lombok', 'Raja Ampat', 'Labuan Bajo', 'Flores', 'Manado', 'Nusa Penida'];
const NIGHTS  = [1, 2, 3, 4, 5, 6, 7, 10, 14];
const today   = new Date().toISOString().split('T')[0];

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', border: 'none', background: 'transparent',
  fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 600,
  color: 'var(--on-surface)', outline: 'none', cursor: 'pointer',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: 4,
};

function GuestCounter({ guests, setGuests }: { guests: number; setGuests: (n: number) => void }) {
  const btnStyle: React.CSSProperties = { width: 28, height: 28, borderRadius: 9999, border: '1.5px solid var(--outline-variant)', background: 'transparent', color: 'var(--primary)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', cursor: 'pointer' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
      <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1} aria-label="Decrease guests" style={{ ...btnStyle, opacity: guests <= 1 ? 0.35 : 1, cursor: guests <= 1 ? 'not-allowed' : 'pointer' }}>−</button>
      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', minWidth: 20, textAlign: 'center' }}>{guests}</span>
      <button type="button" onClick={() => setGuests(Math.min(20, guests + 1))} disabled={guests >= 20} aria-label="Increase guests" style={{ ...btnStyle, opacity: guests >= 20 ? 0.35 : 1, cursor: guests >= 20 ? 'not-allowed' : 'pointer' }}>+</button>
    </div>
  );
}

export default function SearchWidget() {
  const [guests, setGuests] = useState(1);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };

  return (
    <div style={{ width: '100%', maxWidth: 880, background: 'var(--surface-white)', borderRadius: 16, boxShadow: '0 8px 32px rgba(6,27,14,0.18)', overflow: 'hidden', border: '1px solid rgba(195,200,193,0.3)' }}>
      {/* .search-form: column on mobile, row on sm+ via CSS class */}
      <form className="search-form" onSubmit={handleSubmit}>

        <div className="search-field">
          <label style={LABEL_STYLE} htmlFor="sw-location">Location</label>
          <select id="sw-location" style={INPUT_STYLE} defaultValue="">
            <option value="" disabled>Where to?</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="search-field">
          <label style={LABEL_STYLE} htmlFor="sw-checkin">Dates</label>
          <input id="sw-checkin" type="date" style={INPUT_STYLE} min={today} />
        </div>

        <div className="search-field">
          <label style={LABEL_STYLE} htmlFor="sw-nights">Nights</label>
          <select id="sw-nights" style={INPUT_STYLE} defaultValue="">
            <option value="" disabled>Duration</option>
            {NIGHTS.map(n => <option key={n} value={n}>{n} night{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>

        <div className="search-field">
          <span style={LABEL_STYLE}>Guests</span>
          <GuestCounter guests={guests} setGuests={setGuests} />
        </div>

        <button type="submit" aria-label="Search properties"
          style={{ padding: '16px 28px', background: 'var(--primary)', color: 'var(--on-primary)', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.2s', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
        </button>
      </form>
    </div>
  );
}
