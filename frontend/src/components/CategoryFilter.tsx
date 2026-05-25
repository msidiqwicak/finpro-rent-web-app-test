const CATEGORIES = [
  { name: 'Forest',    icon: 'forest'      },
  { name: 'Mountain',  icon: 'landscape'   },
  { name: 'Waterfall', icon: 'water_drop'  },
  { name: 'Meadow',    icon: 'grass'       },
  { name: 'Eco-Farm',  icon: 'agriculture' },
];

function CategoryItem({ name, icon }: { name: string; icon: string }) {
  const handleEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    const box = e.currentTarget.querySelector('.cat-icon-box') as HTMLElement;
    const ico = e.currentTarget.querySelector('.material-symbols-outlined') as HTMLElement;
    if (box) { box.style.background = 'var(--secondary-container)'; box.style.borderColor = 'var(--secondary)'; }
    if (ico) { ico.style.color = 'var(--on-secondary-container)'; }
  };

  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    const box = e.currentTarget.querySelector('.cat-icon-box') as HTMLElement;
    const ico = e.currentTarget.querySelector('.material-symbols-outlined') as HTMLElement;
    if (box) { box.style.background = 'var(--surface-container)'; box.style.borderColor = 'transparent'; }
    if (ico) { ico.style.color = 'var(--on-surface-variant)'; }
  };

  return (
    <button aria-label={`Filter by ${name}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 12, transition: 'transform 0.2s' }}>
      <div className="cat-icon-box" style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-container)', border: '1px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--on-surface-variant)', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24", transition: 'color 0.25s ease' }}>{icon}</span>
      </div>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--on-surface-variant)', letterSpacing: '0.02em' }}>{name}</span>
    </button>
  );
}

export default function CategoryFilter() {
  return (
    <section aria-label="Property categories">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 20px' }} className="md:px-8 lg:px-16">
        <hr style={{ border: 'none', borderTop: '1px solid var(--surface-high)', marginBottom: 32 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px 48px' }}>
          {CATEGORIES.map(cat => <CategoryItem key={cat.name} {...cat} />)}
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--surface-high)', marginTop: 32 }} />
      </div>
    </section>
  );
}
