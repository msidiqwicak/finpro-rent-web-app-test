/* Category icons using Material Symbols Outlined
   Matches reference design: elegant, clean, line-art style
   Icon names from layout.md: forest, landscape, water_drop, grass, agriculture */
const CATEGORIES: { name: string; icon: string }[] = [
  { name: 'Forest',    icon: 'forest'       },
  { name: 'Mountain',  icon: 'landscape'    },
  { name: 'Waterfall', icon: 'water_drop'   },
  { name: 'Meadow',    icon: 'grass'        },
  { name: 'Eco-Farm',  icon: 'agriculture'  },
];

export default function CategoryFilter() {
  return (
    <section aria-label="Property categories">
      <div className="container-page" style={{ paddingBlock: 36 }}>
        <hr style={{ border: 'none', borderTop: '1px solid var(--surface-container-high)', marginBottom: 32 }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px 48px' }}>
          {CATEGORIES.map(({ name, icon }) => (
            <button
              key={name}
              aria-label={`Filter by ${name}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 12,
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                const iconBox = e.currentTarget.querySelector('.cat-icon-box') as HTMLElement;
                const iconEl = e.currentTarget.querySelector('.material-symbols-outlined') as HTMLElement;
                if (iconBox) { iconBox.style.background = 'var(--secondary-container)'; iconBox.style.borderColor = 'var(--secondary)'; }
                if (iconEl) { iconEl.style.color = 'var(--on-secondary-container)'; }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                const iconBox = e.currentTarget.querySelector('.cat-icon-box') as HTMLElement;
                const iconEl = e.currentTarget.querySelector('.material-symbols-outlined') as HTMLElement;
                if (iconBox) { iconBox.style.background = 'var(--surface-container)'; iconBox.style.borderColor = 'transparent'; }
                if (iconEl) { iconEl.style.color = 'var(--on-surface-variant)'; }
              }}
            >
              {/* Icon circle — matches reference: rounded, subtle grey background */}
              <div
                className="cat-icon-box"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'var(--surface-container)',
                  border: '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 28,
                    color: 'var(--on-surface-variant)',
                    fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                    transition: 'color 0.25s ease',
                  }}
                >
                  {icon}
                </span>
              </div>

              {/* Label */}
              <span style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--on-surface-variant)',
                letterSpacing: '0.02em',
              }}>
                {name}
              </span>
            </button>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--surface-container-high)', marginTop: 32 }} />
      </div>
    </section>
  );
}
