import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import PropertyCard, { type PropertyCardProps } from '../shared/PropertyCard';

// ── Skeleton Loader ───────────────────────────────────────────────────
function PropertySkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-outline-variant/40 animate-pulse">
      <div className="w-full aspect-[4/3] bg-surface-container-high" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-5 w-3/4 bg-surface-container-high rounded-md" />
        <div className="h-4 w-1/2 bg-surface-container-high rounded-md" />
        <div className="h-px w-full bg-surface-container-high mt-2" />
        <div className="flex justify-between items-center">
          <div className="h-6 w-1/3 bg-surface-container-high rounded-md" />
          <div className="h-8 w-20 bg-surface-container-high rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
export default function FeaturedProperties() {
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/properties/search', {
          params: { limit: 6, sortBy: 'price', sortOrder: 'asc' }
        });
        const { data } = response.data;
        
        const mappedData: PropertyCardProps[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          city: p.city,
          province: p.province,
          property_category: { name: p.category_name },
          room_type: [
            { 
              price_per_night: p.lowest_price, 
              image_urls: p.image_urls || [] 
            }
          ]
        }));
        
        setProperties(mappedData);
      } catch (err: any) {
        const message = err.response?.data?.error ?? err.message ?? 'Failed to load properties.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const displayed = properties;

  return (
    <section aria-label="Featured properties">
      <div className="max-w-[1280px] mx-auto px-5 py-16 md:px-8 lg:px-16">

        {/* ── Section Header ── */}
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
          <Link
            to="/explore"
            className="font-body text-[14px] font-semibold text-primary flex items-center gap-1 hover:underline transition-all"
          >
            View all
            <span className="material-symbols-outlined text-[16px] font-light">arrow_forward</span>
          </Link>
        </div>

        {/* ── Loading State ── */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <PropertySkeleton key={i} />)}
          </div>
        )}

        {/* ── Error State ── */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-outline">cloud_off</span>
            <p className="text-on-surface-variant text-sm max-w-xs">{error}</p>
          </div>
        )}

        {/* ── Empty State ── */}
        {!isLoading && !error && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-outline">home_work</span>
            <p className="text-on-surface-variant text-sm">No properties available at the moment.</p>
          </div>
        )}

        {/* ── Property Grid ── */}
        {!isLoading && !error && displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
