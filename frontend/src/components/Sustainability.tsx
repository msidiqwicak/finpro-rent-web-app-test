export default function Sustainability() {
  return (
    <section aria-label="Our sustainability mission" style={{ background: 'var(--surface-low)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 20px' }} className="md:px-8 lg:px-16">

        {/* .sustain-grid: 1 col on mobile, 2 col on md+ via CSS class */}
        <div className="sustain-grid">

          <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '16/10', position: 'relative', flexShrink: 0 }}>
            <img
              src="https://res.cloudinary.com/dpxovlms4/image/upload/v1779440988/finpro/assets/sustainability.jpg"
              alt="Person planting a tree in a forest"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingLeft: '2%' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--on-secondary-container)' }}>park</span>
            </div>

            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(24px,3.5vw,32px)', fontWeight: 600, color: 'var(--on-surface)', marginTop: 8 }}>
              Traveling with a Conscience.
            </h2>

            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 18, lineHeight: 1.6, color: 'var(--on-surface-variant)' }}>
              For every booking, we plant a tree to restore local ecosystems. We believe that exploration shouldn't come at the cost of the environment. Our curated properties meet strict sustainability standards, ensuring your stay leaves a positive impact.
            </p>

            <div style={{ marginTop: 8 }}>
              <button
                style={{ display: 'inline-flex', alignItems: 'center', border: '2px solid var(--secondary)', color: 'var(--primary-container)', background: 'transparent', borderRadius: 9999, padding: '10px 24px', fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(86,100,43,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Learn More
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
