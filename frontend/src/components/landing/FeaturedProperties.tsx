import PropertyCard from '../shared/PropertyCard';


const PROPERTIES = [
  { id: 1, name: 'The Mossy Cabin',       location: 'Bandung, Jawa Barat',      price: 185, rating: 4.9, ecoFeature: 'Solar Powered',    imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440989/finpro/assets/mossy_cabin.jpg' },
  { id: 2, name: 'Pine Grove Villa',      location: 'Bali, Indonesia',           price: 240, rating: 4.8, ecoFeature: 'Zero Waste',        imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440989/finpro/assets/pine_grove.jpg' },
  { id: 3, name: 'Waterfall Sanctuary',   location: 'Lombok, NTB',              price: 310, rating: 5.0, ecoFeature: 'Water Positive',    imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440991/finpro/assets/waterfall_sanctuary.jpg' },
  { id: 4, name: 'Jungle Treehouse',      location: 'Yogyakarta, Jawa Tengah',  price: 165, rating: 4.7, ecoFeature: 'Off-Grid',          imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440992/finpro/assets/jungle_treehouse.jpg' },
  { id: 5, name: 'Riverside Bamboo Pod',  location: 'Flores, NTT',              price: 195, rating: 4.8, ecoFeature: 'Carbon Neutral',    imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440992/finpro/assets/riverside_pod.jpg' },
  { id: 6, name: 'Mountain Eco Lodge',    location: 'Raja Ampat, Papua',         price: 420, rating: 5.0, ecoFeature: 'Marine Protected',  imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440993/finpro/assets/mountain_lodge.jpg' },
];

export default function FeaturedProperties() {
  return (
    <section aria-label="Featured properties">
      <div className="max-w-[1280px] mx-auto px-5 py-16 md:px-8 lg:px-16">

        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[15px] text-secondary [font-variation-settings:'FILL'_0,'wght'_300,'GRAD'_0,'opsz'_20]">eco</span>
              <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-secondary">Our Top Picks</p>
            </div>
            <h2 className="font-display text-[clamp(24px,3.5vw,32px)] font-semibold text-on-surface">
              Featured Eco-Retreats
            </h2>
          </div>
          <a href="#" className="font-body text-[14px] font-semibold text-primary flex items-center gap-1 hover:underline transition-all">
            View all
            <span className="material-symbols-outlined text-[16px] font-light">arrow_forward</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROPERTIES.map(p => <PropertyCard key={p.id} {...p} />)}
        </div>
      </div>
    </section>
  );
}
