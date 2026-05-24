import { useState, useEffect, useCallback } from 'react';
import SearchWidget from './SearchWidget';

const SLIDES = [
  { url: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440991/finpro/assets/waterfall_sanctuary.jpg', title: 'Escape into the Heart of Nature',  sub: 'Discover sustainable stays that connect you with the outdoors.' },
  { url: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440989/finpro/assets/mossy_cabin.jpg',         title: 'Sleep Under the Forest Canopy',    sub: 'Handpicked eco-retreats designed for mindful travelers.' },
  { url: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440993/finpro/assets/mountain_lodge.jpg',      title: 'Your Green Sanctuary Awaits',      sub: 'Every stay plants a tree. Travel with purpose.' },
];

const NAV_BTN_STYLE: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
  width: 44, height: 44, borderRadius: 9999, background: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.3)', color: 'white',
  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
};

function HeroNavBtn({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
      style={{ ...NAV_BTN_STYLE, ...(dir === 'prev' ? { left: 16 } : { right: 16 }) }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 26 }}>{dir === 'prev' ? 'chevron_left' : 'chevron_right'}</span>
    </button>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);
  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => { const t = setInterval(next, 5500); return () => clearInterval(t); }, [next]);

  return (
    <section aria-label="Hero carousel" style={{ position: 'relative', width: '100%', height: 'min(90vh, 820px)', minHeight: 560, overflow: 'hidden' }}>
      {/* Slides strip */}
      <div style={{ display: 'flex', height: '100%', transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)', transform: `translateX(-${current * 100}%)` }}>
        {SLIDES.map((slide, i) => (
          <div key={slide.url} style={{ position: 'relative', flex: '0 0 100%', height: '100%' }}>
            <img src={slide.url} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,27,14,0.80) 0%, rgba(6,27,14,0.40) 45%, rgba(6,27,14,0.15) 100%)' }} />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 80, textAlign: 'center', paddingInline: 20 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 9999, background: 'rgba(176,210,185,0.2)', border: '1px solid rgba(176,210,185,0.35)', color: 'var(--primary-fixed)', marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>eco</span>
          Eco-Certified Stays
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(36px,5vw,48px)', fontWeight: 700, lineHeight: 1.17, letterSpacing: '-0.02em', color: 'var(--on-primary)', marginBottom: 16, maxWidth: 720 }}>
          {SLIDES[current].title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: '26px', maxWidth: 520, marginBottom: 48 }}>{SLIDES[current].sub}</p>
        <SearchWidget />
      </div>

      <HeroNavBtn dir="prev" onClick={prev} />
      <HeroNavBtn dir="next" onClick={next} />

      <div role="tablist" aria-label="Slide navigation" style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <button key={i} role="tab" aria-selected={i === current} aria-label={`Slide ${i + 1}`} onClick={() => setCurrent(i)}
            style={{ height: 8, borderRadius: 9999, border: 'none', transition: 'all 0.3s ease', width: i === current ? 24 : 8, background: i === current ? 'var(--primary-fixed)' : 'rgba(255,255,255,0.5)' }} />
        ))}
      </div>
    </section>
  );
}
