const STATS = [
  { icon: 'park',           value: '12,480', label: 'Trees Planted'   },
  { icon: 'cottage',        value: '340+',   label: 'Eco Properties'  },
  { icon: 'public',         value: '28',     label: 'Countries'       },
  { icon: 'verified',       value: '100%',   label: 'Verified Stays'  },
];

export default function Sustainability() {
  return (
    <section aria-label="Our sustainability mission" style={{ background: 'var(--surface-container-low)' }}>
      <div className="container-page section-gap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48, alignItems: 'center' }} id="sustain-grid">
          <style>{`@media(min-width:768px){#sustain-grid{grid-template-columns:1fr 1fr}}`}</style>

          {/* Image — aspect-ratio, no fixed height */}
          <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/3', boxShadow: 'var(--shadow-raised)', position: 'relative', flexShrink: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop"
              alt="Person planting a tree in a forest"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Floating badge */}
            <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--secondary)', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 40" }}>park</span>
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--primary-container)', lineHeight: 1.2 }}>12,480</p>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 500, color: 'var(--on-surface-variant)' }}>Trees Planted So Far</p>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Overline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--secondary)', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>spa</span>
              <p className="text-overline" style={{ color: 'var(--secondary)' }}>Our Mission</p>
            </div>

            <h2 className="text-headline-md" style={{ color: 'var(--on-surface)' }}>Traveling with a Conscience.</h2>

            <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)' }}>
              For every booking, we plant a tree to restore local ecosystems. We believe that exploration shouldn't come at the cost of the environment. Our curated properties meet strict sustainability standards, ensuring your stay leaves a positive impact.
            </p>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {STATS.map(({ icon, value, label }) => (
                <div key={label} className="sustain-stat">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--on-secondary-container)', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>{icon}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--primary-container)', lineHeight: 1.2 }}>{value}</p>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 500, color: 'var(--on-surface-variant)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 4 }}>
              <button className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Learn More
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
