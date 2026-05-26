function EcoBadge({ label }: { label: string }) {
  return (
    <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold text-primary-container whitespace-nowrap">
      <span className="material-symbols-outlined text-[14px] text-secondary [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_20]">eco</span>
      {label}
    </div>
  );
}

function WishlistBtn({ name }: { name: string }) {
  return (
    <button aria-label={`Save ${name} to wishlist`}
      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/88 backdrop-blur-sm flex items-center justify-center text-outline hover:text-red-500 hover:bg-white transition-all duration-200"
    >
      <span className="material-symbols-outlined text-[18px] [font-variation-settings:'FILL'_0,'wght'_300,'GRAD'_0,'opsz'_24]">favorite</span>
    </button>
  );
}

interface PropertyCardProps {
  name:       string;
  location:   string;
  price:      number;
  rating:     number;
  imageUrl:   string;
  ecoFeature: string;
}

export default function PropertyCard({ name, location, price, rating, imageUrl, ecoFeature }: PropertyCardProps) {
  return (
    <article className="group bg-surface-white rounded-2xl overflow-hidden border border-outline-variant/40 shadow-[0_2px_12px_rgba(6,27,14,0.06)] hover:shadow-[0_8px_24px_rgba(6,27,14,0.10)] hover:-translate-y-1 transition-all duration-300 flex flex-col">

      <div className="relative w-full aspect-[4/3] overflow-hidden shrink-0">
        <img src={imageUrl} alt={name} loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <EcoBadge label={ecoFeature} />
        <WishlistBtn name={name} />
      </div>

      <div className="p-5 flex flex-col flex-1 gap-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-display font-bold text-[17px] text-on-surface leading-snug">{name}</h3>
          <div className="flex items-center gap-1 text-[13px] font-bold text-on-surface whitespace-nowrap">
            <span className="material-symbols-outlined text-[15px] text-amber-400 [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_20]">star</span>
            {rating.toFixed(1)}
          </div>
        </div>

        <p className="text-[13px] text-on-surface-variant mb-3">
          <span className="material-symbols-outlined text-[14px] align-middle mr-0.5 text-on-surface-variant [font-variation-settings:'FILL'_0,'wght'_300,'GRAD'_0,'opsz'_20]">location_on</span>
          {location}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-surface-high">
          <p className="font-display font-extrabold text-[20px] text-primary-container">
            ${price} <span className="text-[13px] font-normal text-on-surface-variant font-body">/ night</span>
          </p>
          <button className="text-[13px] px-4 py-1.5 rounded-lg flex items-center gap-1 bg-secondary-container text-on-secondary-container font-semibold hover:opacity-80 transition-opacity cursor-pointer border-none">
            View <span className="material-symbols-outlined text-[16px] [font-variation-settings:'FILL'_0,'wght'_300,'GRAD'_0,'opsz'_20]">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
}
