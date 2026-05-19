interface PropertyProps {
  name: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  ecoFeature: string;
}

export default function PropertyCard({ name, location, price, rating, imageUrl, ecoFeature }: PropertyProps) {
  return (
    <article className="bg-surface rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow duration-300 group cursor-pointer">
      <div className="relative h-64 overflow-hidden">
        <img 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={imageUrl} 
        />
        <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
          <span className="text-sm text-secondary">🍃</span>
          <span className="font-caption text-caption text-on-surface">{ecoFeature}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col h-[calc(100%-16rem)]">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-headline-sm text-[20px] text-on-surface">{name}</h3>
          <div className="flex items-center gap-1 text-on-surface">
            <span className="text-sm">⭐</span>
            <span className="font-label-md text-label-md">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-4">{location}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="font-headline-sm text-[18px] text-primary-container font-bold">
            ${price} <span className="font-body-md text-sm font-normal text-on-surface-variant">/ night</span>
          </p>
        </div>
      </div>
    </article>
  );
}
