interface PropertyCardProps {
  name:       string;
  location:   string;
  price:      number;
  rating:     number;
  imageUrl:   string;
  ecoFeature: string;
}

function EcoBadge({ label }: { label: string }) {
  return (
    <div style={{ position: 'absolute', top: 12, left: 12, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 9999, background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(6px)', fontSize: 11, fontWeight: 700, color: 'var(--primary-container)', whiteSpace: 'nowrap' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20", color: 'var(--secondary)' }}>eco</span>
      {label}
    </div>
  );
}

function WishlistBtn({ name }: { name: string }) {
  return (
    <button aria-label={`Save ${name} to wishlist`}
      style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 9999, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--outline)', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.color = '#e63946'; e.currentTarget.style.background = 'white'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--outline)'; e.currentTarget.style.background = 'rgba(255,255,255,0.88)'; }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>favorite</span>
    </button>
  );
}

export default function PropertyCard({ name, location, price, rating, imageUrl, ecoFeature }: PropertyCardProps) {
  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.boxShadow = '0 8px 24px rgba(6,27,14,0.10)';
    el.style.transform  = 'translateY(-4px)';
    const img = el.querySelector('img') as HTMLImageElement;
    if (img) img.style.transform = 'scale(1.06)';
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.boxShadow = '0 2px 12px rgba(6,27,14,0.06)';
    el.style.transform  = 'translateY(0)';
    const img = el.querySelector('img') as HTMLImageElement;
    if (img) img.style.transform = 'scale(1)';
  };

  return (
    <article onMouseEnter={handleEnter} onMouseLeave={handleLeave}
      style={{ background: 'var(--surface-white)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(195,200,193,0.4)', boxShadow: '0 2px 12px rgba(6,27,14,0.06)', transition: 'box-shadow 0.3s ease, transform 0.3s ease', display: 'flex', flexDirection: 'column' }}>

      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', flexShrink: 0 }}>
        <img src={imageUrl} alt={name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.5s ease' }} />
        <EcoBadge label={ecoFeature} />
        <WishlistBtn name={name} />
      </div>

      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1, gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17, fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.3 }}>{name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', whiteSpace: 'nowrap' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20", color: '#f59e0b' }}>star</span>
            {rating.toFixed(1)}
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 12 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 3, color: 'var(--on-surface-variant)', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>location_on</span>
          {location}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--surface-high)' }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--primary-container)' }}>
            ${price} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--on-surface-variant)', fontFamily: "'Manrope',sans-serif" }}>/ night</span>
          </p>
          <button style={{ fontSize: 13, padding: '7px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4, background: 'var(--secondary-container)', color: 'var(--on-secondary-container)', fontWeight: 600, transition: 'opacity 0.2s' }}>
            View <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
}
