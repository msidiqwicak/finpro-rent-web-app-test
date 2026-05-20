import { useState } from 'react';

const CITIES = ['Bali', 'Bandung', 'Yogyakarta', 'Lombok', 'Raja Ampat', 'Labuan Bajo', 'Flores', 'Manado', 'Nusa Penida'];

const today = new Date().toISOString().split('T')[0];

export default function SearchWidget() {
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: redirect to /search with query params
  };

  return (
    <div className="search-widget">
      <form className="search-widget__form" onSubmit={handleSubmit}>

        {/* Location */}
        <div className="search-field">
          <label className="search-field__label" htmlFor="sw-location">Location</label>
          <select id="sw-location" className="search-field__select" defaultValue="">
            <option value="" disabled>Where to?</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Check-in */}
        <div className="search-field">
          <label className="search-field__label" htmlFor="sw-checkin">Dates</label>
          <input id="sw-checkin" type="date" className="search-field__input" min={today} />
        </div>

        {/* Nights / Duration */}
        <div className="search-field">
          <label className="search-field__label" htmlFor="sw-nights">Nights</label>
          <select id="sw-nights" className="search-field__select" defaultValue="">
            <option value="" disabled>Duration</option>
            {[1,2,3,4,5,6,7,10,14].map(n => <option key={n} value={n}>{n} night{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>

        {/* Guests */}
        <div className="search-field">
          <span className="search-field__label">Guests</span>
          <div className="search-field__guest-row">
            <button type="button" className="guest-btn" onClick={() => setGuests(g => Math.max(1, g - 1))} disabled={guests <= 1} aria-label="Decrease guests">−</button>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', minWidth: 20, textAlign: 'center' }}>{guests}</span>
            <button type="button" className="guest-btn" onClick={() => setGuests(g => Math.min(20, g + 1))} disabled={guests >= 20} aria-label="Increase guests">+</button>
          </div>
        </div>

        {/* Submit — Material Symbol search icon */}
        <button type="submit" className="search-widget__submit" aria-label="Search properties">
          <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
        </button>
      </form>
    </div>
  );
}
