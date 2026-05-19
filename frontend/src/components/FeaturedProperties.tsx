import PropertyCard from './PropertyCard';

const DUMMY_PROPERTIES = [
  {
    id: 1,
    name: 'The Mossy Cabin',
    location: 'Olympic Peninsula, WA',
    price: 185,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1000&auto=format&fit=crop',
    ecoFeature: 'Solar Powered'
  },
  {
    id: 2,
    name: 'Pine Grove Villa',
    location: 'Catskill Mountains, NY',
    price: 240,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-c5a42a1f8db8?q=80&w=1000&auto=format&fit=crop',
    ecoFeature: 'Zero Waste'
  },
  {
    id: 3,
    name: 'Waterfall Sanctuary',
    location: 'Blue Ridge Parkway, NC',
    price: 310,
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop',
    ecoFeature: 'Water Positive'
  }
];

export default function FeaturedProperties() {
  return (
    <section className="py-20 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[var(--spacing-container-max)] mx-auto">
      <div className="flex justify-between items-end mb-12">
        <h2 className="font-headline-md text-headline-md text-on-surface">Featured Eco-Retreats</h2>
        <a href="#" className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1">
          View all <span>→</span>
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {DUMMY_PROPERTIES.map((prop) => (
          <PropertyCard key={prop.id} {...prop} />
        ))}
      </div>
    </section>
  );
}
