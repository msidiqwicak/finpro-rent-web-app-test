interface PropertyCardProps {
  name: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  ecoFeature: string;
}

export default function PropertyCard({ name, location, price, rating, imageUrl, ecoFeature }: PropertyCardProps) {
  return (
    <article className="property-card">
      {/* Image — fixed aspect ratio prevents height inconsistency */}
      <div className="property-card__image-wrap">
        <img src={imageUrl} alt={name} loading="lazy" />

        {/* Eco badge — pill with Material Symbol icon */}
        <div className="eco-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20", color: 'var(--secondary)' }}>eco</span>
          <span>{ecoFeature}</span>
        </div>

        {/* Wishlist */}
        <button className="wishlist-btn" aria-label={`Save ${name} to wishlist`}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>favorite</span>
        </button>
      </div>

      {/* Card body */}
      <div className="property-card__body">
        <div className="property-card__header">
          <h3 className="property-card__name">{name}</h3>
          <div className="property-card__rating">
            <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20", color: '#f59e0b' }}>star</span>
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="property-card__location">
          <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 3, color: 'var(--on-surface-variant)', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>location_on</span>
          {location}
        </p>

        <div className="property-card__footer">
          <p className="property-card__price">
            {'$'}{price} <span>/ night</span>
          </p>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 13, padding: '7px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            View
            <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
}
