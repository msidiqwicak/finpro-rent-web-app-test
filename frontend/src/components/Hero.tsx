import { useState, useEffect, useCallback } from 'react';
import SearchWidget from './SearchWidget';

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2000&auto=format&fit=crop',
    title: 'Escape into the Heart of Nature',
    sub: 'Discover sustainable stays that connect you with the outdoors.',
  },
  {
    url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2000&auto=format&fit=crop',
    title: 'Sleep Under the Forest Canopy',
    sub: 'Handpicked eco-retreats designed for mindful travelers.',
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop',
    title: 'Your Green Sanctuary Awaits',
    sub: 'Every stay plants a tree. Travel with purpose.',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);
  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="hero" aria-label="Hero carousel">
      {/* Slides */}
      <div className="hero__slides" style={{ transform: `translateX(-${current * 100}%)` }}>
        {SLIDES.map((slide, i) => (
          <div key={slide.url} className="hero__slide">
            <img src={slide.url} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="hero__overlay" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="hero__content">
        {/* Eco badge — Material Symbol icon, no emoji */}
        <div className="hero__badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>eco</span>
          Eco-Certified Stays
        </div>

        <h1 className="text-display-lg hero__title">{SLIDES[current].title}</h1>
        <p className="hero__subtitle">{SLIDES[current].sub}</p>
        <SearchWidget />
      </div>

      {/* Prev button */}
      <button className="hero__nav-btn hero__nav-btn--prev" onClick={prev} aria-label="Previous slide">
        <span className="material-symbols-outlined" style={{ fontSize: 26 }}>chevron_left</span>
      </button>

      {/* Next button */}
      <button className="hero__nav-btn hero__nav-btn--next" onClick={next} aria-label="Next slide">
        <span className="material-symbols-outlined" style={{ fontSize: 26 }}>chevron_right</span>
      </button>

      {/* Dots */}
      <div className="hero__dots" role="tablist" aria-label="Slide navigation">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            className={`hero__dot ${i === current ? 'hero__dot--active' : 'hero__dot--inactive'}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
}
