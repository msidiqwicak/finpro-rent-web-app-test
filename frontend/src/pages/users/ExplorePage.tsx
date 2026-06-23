import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SearchWidget from '../../components/landing/SearchWidget';
import CategoryFilter from '../../components/landing/CategoryFilter';
import PropertyCard, { type PropertyCardProps } from '../../components/shared/PropertyCard';
import api from '../../api/axiosConfig';

// ── Active Filter Pills ───────────────────────────────────────────────
function ActiveFilters({ params, onClear }: { params: URLSearchParams; onClear: (key: string) => void }) {
  const filters = ['search', 'city', 'category', 'guests', 'checkIn', 'checkOut']
    .map((key) => ({ key, value: params.get(key) }))
    .filter((f) => f.value);

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-[13px] text-on-surface-variant font-medium">Active filters:</span>
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onClear(f.key)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[12px] font-semibold border-none cursor-pointer hover:opacity-80 transition-opacity"
        >
          {f.key}: {f.value}
          <span className="material-symbols-outlined text-[14px]">close</span>
        </button>
      ))}
    </div>
  );
}

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

// ── Main Page ─────────────────────────────────────────────────────────
export default function ExplorePage() {
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract all params
  const category   = searchParams.get('category')   ?? '';
  const city       = searchParams.get('city')       ?? '';
  const search     = searchParams.get('search')     ?? '';
  const checkIn    = searchParams.get('checkIn')    ?? '';
  const checkOut   = searchParams.get('checkOut')   ?? '';
  const page       = parseInt(searchParams.get('page') ?? '1', 10);
  const sort       = searchParams.get('sort')       ?? 'name-asc'; // format: field-order

  const hasFilters = !!(category || city || search || checkIn || checkOut);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [sortBy, sortOrder] = sort.split('-');

        const params: Record<string, string | number> = {
          page,
          limit: 9, // 9 items per page fits 3 columns perfectly
          sortBy,
          sortOrder
        };

        if (category)   params.category   = category;
        if (city)       params.city       = city;
        if (search)     params.search     = search;
        if (checkIn)    params.checkIn    = checkIn;
        if (checkOut)   params.checkOut   = checkOut;

        // Fetch from the new advanced search API
        const response = await api.get('/properties/search', { params });
        const { data, pagination: pagData } = response.data;
        
        // Map the flat API response to PropertyCardProps format seamlessly
        const mappedProperties: PropertyCardProps[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          city: p.city,
          province: p.province,
          property_category: { name: p.category_name },
          // Mock the room_type structure so PropertyCard can read price & image
          room_type: [
            { 
              price_per_night: p.lowest_price, 
              image_urls: p.image_urls || [] 
            }
          ]
        }));

        setProperties(mappedProperties);
        if (pagData) setPagination(pagData);
      } catch (err: any) {
        setError(err.response?.data?.error ?? err.message ?? 'Failed to load properties.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [category, city, search, checkIn, checkOut, page, sort]);

  const handleClearFilter = (key: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(key);
      next.delete('page'); // Reset page when changing filters
      return next;
    });
  };

  const handleClearAll = () => setSearchParams(new URLSearchParams());

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('sort', e.target.value);
      next.set('page', '1'); // Reset to page 1 on sort
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', newPage.toString());
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heading = hasFilters
    ? `Filtered Results${city ? ` in ${city}` : ''}`
    : 'Explore All Properties';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-low">
        <div className="max-w-[1280px] mx-auto px-5 py-10 md:px-8 lg:px-16">

          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-2 text-[13px] text-on-surface-variant mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Explore</span>
          </nav>

          {/* ── Search Widget ── */}
          <div className="sticky top-[72px] z-40 -mx-5 md:-mx-8 lg:-mx-16">
            <div className="bg-surface-low border-b border-outline-variant/30 px-5 md:px-8 lg:px-16 py-4">
              <div className="flex justify-center w-full min-h-[56px] items-center">
                <div className="w-full max-w-[1000px]">
                  <SearchWidget scrollThreshold={10} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Category Filter ── */}
          <div className="-mx-5 md:-mx-8 lg:-mx-16 mb-4">
            <CategoryFilter />
          </div>

          {/* ── Header & Sorting ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="material-symbols-outlined text-[15px] text-secondary [font-variation-settings:'FILL'_0,'wght'_300,'GRAD'_0,'opsz'_20]">
                  {hasFilters ? 'filter_alt' : 'explore'}
                </span>
                <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-secondary">
                  {hasFilters ? 'Filtered Results' : 'All Properties'}
                </p>
              </div>
              <h1 className="font-display text-[clamp(24px,3.5vw,32px)] font-semibold text-on-surface">
                {heading}
              </h1>
              {!isLoading && (
                <p className="text-[14px] text-on-surface-variant mt-1">
                  {pagination.total} {pagination.total === 1 ? 'property' : 'properties'} found
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {hasFilters && (
                <button
                  onClick={handleClearAll}
                  className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface text-[13px] font-semibold bg-transparent hover:bg-surface-container-low cursor-pointer transition-colors"
                >
                  Clear all filters
                </button>
              )}
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-white border border-outline-variant rounded-full px-4 py-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">sort</span>
                <select 
                  value={sort} 
                  onChange={handleSortChange}
                  className="bg-transparent border-none text-[13px] font-semibold text-on-surface focus:outline-none cursor-pointer pr-4"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Lowest Price</option>
                  <option value="price-desc">Highest Price</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Active Filter Pills ── */}
          <ActiveFilters params={searchParams} onClear={handleClearFilter} />

          {/* ── Loading State ── */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {Array.from({ length: 9 }).map((_, i) => <PropertySkeleton key={i} />)}
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
          {!isLoading && !error && properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <span className="material-symbols-outlined text-[56px] text-outline">search_off</span>
              <p className="text-on-surface-variant text-[15px] max-w-sm">
                {hasFilters
                  ? 'No properties match your filters. Try adjusting your search or clearing the filters.'
                  : 'No properties available at the moment.'}
              </p>
              {hasFilters && (
                <button
                  onClick={handleClearAll}
                  className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-[13px] font-bold border-none cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* ── Property Grid ── */}
          {!isLoading && !error && properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {!isLoading && !error && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-8 border-t border-outline-variant/30">
              <button 
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-on-surface hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              
              <span className="text-[14px] font-semibold text-on-surface">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <button 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-on-surface hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
