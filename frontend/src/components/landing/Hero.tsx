import { useState, useEffect, useCallback } from 'react';

const SLIDES = [
  { url: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440991/finpro/assets/waterfall_sanctuary.jpg', title: 'Escape into the Heart of Nature',  sub: 'Discover sustainable stays that connect you with the outdoors.' },
  { url: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440989/finpro/assets/mossy_cabin.jpg',         title: 'Sleep Under the Forest Canopy',    sub: 'Handpicked eco-retreats designed for mindful travelers.' },
  { url: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440993/finpro/assets/mountain_lodge.jpg',      title: 'Your Green Sanctuary Awaits',      sub: 'Every stay plants a tree. Travel with purpose.' },
];

function HeroNavBtn({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
      className={`absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/15 border border-white/30 text-white flex items-center justify-center hover:bg-white/28 transition-colors ${dir === 'prev' ? 'left-4' : 'right-4'}`}
    >
      <span className="material-symbols-outlined text-[26px]">{dir === 'prev' ? 'chevron_left' : 'chevron_right'}</span>
    </button>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);
  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => { const t = setInterval(next, 5500); return () => clearInterval(t); }, [next]);

  return (
    <section aria-label="Hero carousel" className="relative w-full overflow-hidden" style={{ height: 'min(90vh, 820px)', minHeight: 560 }}>

      {/* Slides strip — uses inline style for JS-driven translateX */}
      <div className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div key={slide.url} className="relative flex-[0_0_100%] h-full">
            <img src={slide.url} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,27,14,0.80)_0%,rgba(6,27,14,0.40)_45%,rgba(6,27,14,0.15)_100%)]" />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-5 pb-70">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] uppercase px-3.5 py-1.5 rounded-full bg-primary-fixed/20 border border-primary-fixed/35 text-primary-fixed mb-5">
          <span className="material-symbols-outlined text-[14px] [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_20]">eco</span>
          Eco-Certified Stays
        </div>
        <h1 className="font-display font-bold text-[clamp(36px,5vw,48px)] leading-[1.17] tracking-[-0.02em] text-on-primary mb-4 max-w-[720px]">
          {SLIDES[current].title}
        </h1>
        <p className="text-white/82 text-[17px] leading-relaxed max-w-[520px]">{SLIDES[current].sub}</p>
      </div>

      <HeroNavBtn dir="prev" onClick={prev} />
      <HeroNavBtn dir="next" onClick={next} />

      <div role="tablist" aria-label="Slide navigation" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button key={i} role="tab" aria-selected={i === current} aria-label={`Slide ${i + 1}`} onClick={() => setCurrent(i)}
            className={`h-2 rounded-full border-none transition-all duration-300 cursor-pointer ${i === current ? 'w-6 bg-primary-fixed' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}
