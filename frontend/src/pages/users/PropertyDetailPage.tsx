import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../api/axiosConfig';

// ── Types ─────────────────────────────────────────────────────
interface RoomType {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  total_units: number;
  amenities: string[];
  image_urls: string[];
  price_per_night: number;
  adjusted_price: number;
}

interface PropertyDetail {
  id: string;
  name: string;
  description?: string;
  image_urls?: string[];
  address: string;
  city: string;
  province: string;
  property_category: { name: string } | null;
  tenant: { id: string; name: string; image_url?: string | null };
  room_type: RoomType[];
  review?: { rating: number; comment?: string; users?: { name: string } }[];
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop';
const formatPrice = (n: number) => new Intl.NumberFormat('id-ID').format(n);
const today = new Date().toISOString().split('T')[0];

// ── Amenity Icon Map ──────────────────────────────────────────
const AMENITY_ICONS: Record<string, string> = {
  wifi: 'wifi', 'Wi-Fi': 'wifi', ac: 'ac_unit', AC: 'ac_unit',
  parking: 'local_parking', pool: 'pool', kitchen: 'kitchen',
  tv: 'tv', TV: 'tv', gym: 'fitness_center', laundry: 'local_laundry_service',
  balcony: 'balcony', garden: 'yard', spa: 'spa', restaurant: 'restaurant',
  elevator: 'elevator', security: 'security', 'hot water': 'hot_tub',
};

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        if (!property) setIsLoading(true);
        const url = checkin ? `/properties/${id}?date=${checkin}` : `/properties/${id}`;
        const res = await api.get(url);
        const data = res.data.data ?? res.data;
        setProperty(data);
        
        // Ensure the selected room's price is updated if it was already selected
        if (selectedRoom) {
          const updatedRoom = data.room_type?.find((rt: any) => rt.id === selectedRoom.id);
          if (updatedRoom) setSelectedRoom(updatedRoom);
        } else if (data.room_type?.length > 0) {
          setSelectedRoom(data.room_type[0]);
        }
      } catch (err: any) {
        setError(err.response?.data?.error ?? 'Properti tidak ditemukan.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id, checkin]);

  const handleBookNow = () => {
    if (!selectedRoom || !checkin || !checkout) return;
    const params = new URLSearchParams();
    params.set('roomTypeId', selectedRoom.id);
    params.set('checkin', checkin);
    params.set('checkout', checkout);
    params.set('guests', String(guests));
    navigate(`/checkout/${id}?${params.toString()}`, {
      state: {
        checkIn: checkin,
        checkOut: checkout,
        roomName: selectedRoom.name,
        pricePerNight: selectedRoom.adjusted_price
      }
    });
  };

  // Calculate nights
  const nightCount = checkin && checkout
    ? Math.max(1, Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000))
    : 0;

  if (isLoading) return <><Navbar /><LoadingSkeleton /><Footer /></>;
  if (error || !property) return <><Navbar /><ErrorState message={error} /><Footer /></>;

  // Collect all images from room types + property
  const allImages = [
    ...(property.image_urls || []),
    ...property.room_type.flatMap((rt) => rt.image_urls),
  ].filter(Boolean) as string[];
  if (allImages.length === 0) allImages.push(PLACEHOLDER);

  // Collect all unique amenities
  const allAmenities = [...new Set(property.room_type.flatMap((rt) => rt.amenities))];
  const maxCapacity = Math.max(...property.room_type.map((rt) => rt.capacity), 1);
  const category = property.property_category?.name ?? 'Property';

  return (
    <>
      <Navbar />
      <main className="bg-surface-low min-h-screen">
        <div className="max-w-[1280px] mx-auto px-5 pt-6 pb-16 md:px-8 lg:px-16">

          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-2 text-[13px] text-on-surface-variant mb-5 flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/explore" className="hover:text-primary transition-colors">Explore</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold truncate max-w-[200px]">{property.name}</span>
          </nav>

          {/* ── Header ── */}
          <div className="mb-6">
            <h1 className="font-display text-[clamp(22px,3.5vw,32px)] font-bold text-on-surface mb-2">{property.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-[14px] text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {property.address}, {property.city}, {property.province}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[12px] font-bold">
                <span className="material-symbols-outlined text-[14px] [font-variation-settings:'FILL'_1]">eco</span>
                {category}
              </span>
            </div>
          </div>

          {/* ── Image Gallery (Airbnb Grid) ── */}
          <div className="rounded-2xl overflow-hidden mb-10">
            <div className={`grid gap-1 ${allImages.length >= 5 ? 'grid-cols-4 grid-rows-2' : allImages.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`} style={{ maxHeight: 460 }}>
              {allImages.slice(0, 5).map((url, i) => (
                <div key={i} className={`overflow-hidden ${i === 0 && allImages.length >= 5 ? 'col-span-2 row-span-2' : ''}`}>
                  <img src={url} alt={`${property.name} - ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" style={{ minHeight: i === 0 ? 460 : 228 }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Two-Column Layout ── */}
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── LEFT COLUMN (Main Content) ── */}
            <div className="flex-1 min-w-0">

              {/* Host Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-outline-variant/50 mb-6">
                <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-primary/20">
                  {property.tenant.image_url ? (
                    <img src={property.tenant.image_url} alt={property.tenant.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[28px] text-on-surface-variant">person</span>
                  )}
                </div>
                <div>
                  <p className="font-display font-bold text-[17px] text-on-surface">Hosted by {property.tenant.name}</p>
                  <p className="text-[13px] text-on-surface-variant">
                    {category} · Up to {maxCapacity} guests · {property.room_type.length} room type{property.room_type.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-8">
                  <h2 className="font-display font-bold text-[20px] text-on-surface mb-3">About this place</h2>
                  <p className="text-[15px] text-on-surface-variant leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {allAmenities.length > 0 && (
                <div className="mb-8 pb-8 border-b border-outline-variant/50">
                  <h2 className="font-display font-bold text-[20px] text-on-surface mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allAmenities.map((a) => (
                      <div key={a} className="flex items-center gap-2.5 text-[14px] text-on-surface-variant py-2">
                        <span className="material-symbols-outlined text-[20px] text-primary [font-variation-settings:'FILL'_0,'wght'_300]">
                          {AMENITY_ICONS[a] ?? AMENITY_ICONS[a.toLowerCase()] ?? 'check_circle'}
                        </span>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Types */}
              <div className="mb-8">
                <h2 className="font-display font-bold text-[20px] text-on-surface mb-4">Available Room Types</h2>
                <div className="flex flex-col gap-4">
                  {property.room_type.map((rt) => (
                    <button
                      key={rt.id}
                      onClick={() => setSelectedRoom(rt)}
                      className={`flex gap-4 p-4 rounded-xl border-2 text-left bg-transparent cursor-pointer transition-all ${
                        selectedRoom?.id === rt.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-outline-variant/40 hover:border-primary/50'
                      }`}
                    >
                      <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
                        <img src={rt.image_urls[0] ?? PLACEHOLDER} alt={rt.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-[16px] text-on-surface mb-1">{rt.name}</p>
                        <p className="text-[13px] text-on-surface-variant mb-2">
                          Up to {rt.capacity} guest{rt.capacity > 1 ? 's' : ''} · {rt.total_units} unit{rt.total_units > 1 ? 's' : ''}
                        </p>
                        <p className="font-display font-extrabold text-[18px] text-primary-container">
                          Rp {formatPrice(rt.adjusted_price)}
                          <span className="text-[13px] font-normal text-on-surface-variant font-body"> / night</span>
                        </p>
                      </div>
                      {selectedRoom?.id === rt.id && (
                        <span className="material-symbols-outlined text-primary text-[24px] self-center [font-variation-settings:'FILL'_1]">check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="pb-8 border-b border-outline-variant/50">
                <h2 className="font-display font-bold text-[20px] text-on-surface mb-3">Location</h2>
                <p className="text-[15px] text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  {property.address}, {property.city}, {property.province}
                </p>
              </div>
            </div>

            {/* ── RIGHT COLUMN (Sticky Booking Card) ── */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="sticky top-[88px]">
                <div className="bg-surface-white rounded-2xl border border-outline-variant/40 shadow-[0_4px_24px_rgba(6,27,14,0.10)] p-6">

                  {/* Price */}
                  {selectedRoom && (
                    <div className="mb-5">
                      <p className="font-display font-extrabold text-[26px] text-primary-container leading-tight">
                        Rp {formatPrice(selectedRoom.adjusted_price)}
                        <span className="text-[14px] font-normal text-on-surface-variant font-body"> / night</span>
                      </p>
                      <p className="text-[13px] text-on-surface-variant mt-1">{selectedRoom.name}</p>
                    </div>
                  )}

                  {/* Date Inputs */}
                  <div className="grid grid-cols-2 gap-0 mb-4 rounded-xl border border-outline-variant overflow-hidden">
                    <div className="p-3 border-r border-outline-variant">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Check-in</label>
                      <input type="date" min={today} value={checkin}
                        onChange={(e) => { setCheckin(e.target.value); if (checkout && e.target.value >= checkout) setCheckout(''); }}
                        className="w-full bg-transparent border-none text-[14px] font-semibold text-on-surface outline-none cursor-pointer" />
                    </div>
                    <div className="p-3">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Check-out</label>
                      <input type="date" min={checkin || today} value={checkout}
                        onChange={(e) => setCheckout(e.target.value)}
                        className="w-full bg-transparent border-none text-[14px] font-semibold text-on-surface outline-none cursor-pointer" />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="p-3 mb-4 rounded-xl border border-outline-variant">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Guests</label>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-on-surface">{guests} guest{guests > 1 ? 's' : ''}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1}
                          className="w-8 h-8 rounded-full border border-outline-variant bg-transparent text-primary flex items-center justify-center cursor-pointer disabled:opacity-30">−</button>
                        <button type="button" onClick={() => setGuests(Math.min(selectedRoom?.capacity ?? 10, guests + 1))} disabled={guests >= (selectedRoom?.capacity ?? 10)}
                          className="w-8 h-8 rounded-full border border-outline-variant bg-transparent text-primary flex items-center justify-center cursor-pointer disabled:opacity-30">+</button>
                      </div>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={handleBookNow}
                    disabled={!selectedRoom || !checkin || !checkout}
                    className="w-full py-4 rounded-xl bg-primary text-on-primary font-display font-bold text-[16px] border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {!checkin || !checkout ? 'Select dates to book' : 'Book Now'}
                  </button>

                  {/* Price Breakdown */}
                  {selectedRoom && nightCount > 0 && (
                    <div className="mt-5 pt-5 border-t border-outline-variant/50 space-y-2">
                      <div className="flex justify-between text-[14px] text-on-surface-variant">
                        <span>Rp {formatPrice(selectedRoom.adjusted_price)} × {nightCount} night{nightCount > 1 ? 's' : ''}</span>
                        <span>Rp {formatPrice(selectedRoom.adjusted_price * nightCount)}</span>
                      </div>
                      <div className="flex justify-between text-[14px] text-on-surface-variant">
                        <span>Service fee</span>
                        <span>Rp {formatPrice(Math.round(selectedRoom.adjusted_price * nightCount * 0.05))}</span>
                      </div>
                      <div className="flex justify-between text-[16px] font-bold text-on-surface pt-3 border-t border-outline-variant/50">
                        <span>Total</span>
                        <span>Rp {formatPrice(Math.round(selectedRoom.adjusted_price * nightCount * 1.05))}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Mobile Bottom Bar ── */}
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-white border-t border-outline-variant shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-5 py-3 flex items-center justify-between lg:hidden">
                <div>
                  {selectedRoom && (
                    <p className="font-display font-extrabold text-[18px] text-primary-container">
                      Rp {formatPrice(selectedRoom.adjusted_price)}
                      <span className="text-[12px] font-normal text-on-surface-variant font-body"> / night</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={handleBookNow}
                  disabled={!selectedRoom || !checkin || !checkout}
                  className="px-8 py-3 rounded-xl bg-primary text-on-primary font-display font-bold text-[14px] border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <main className="bg-surface-low min-h-screen">
      <div className="max-w-[1280px] mx-auto px-5 pt-6 pb-16 md:px-8 lg:px-16 animate-pulse">
        <div className="h-4 w-48 bg-surface-container-high rounded mb-6" />
        <div className="h-8 w-2/3 bg-surface-container-high rounded mb-3" />
        <div className="h-4 w-1/3 bg-surface-container-high rounded mb-8" />
        <div className="grid grid-cols-4 grid-rows-2 gap-1 rounded-2xl overflow-hidden mb-10" style={{ height: 460 }}>
          <div className="col-span-2 row-span-2 bg-surface-container-high" />
          <div className="bg-surface-container-high" />
          <div className="bg-surface-container-high" />
          <div className="bg-surface-container-high" />
          <div className="bg-surface-container-high" />
        </div>
        <div className="flex gap-10">
          <div className="flex-1 space-y-4">
            <div className="h-6 w-1/2 bg-surface-container-high rounded" />
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-3/4 bg-surface-container-high rounded" />
          </div>
          <div className="w-[380px] hidden lg:block">
            <div className="h-[400px] bg-surface-container-high rounded-2xl" />
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Error State ───────────────────────────────────────────────
function ErrorState({ message }: { message: string | null }) {
  return (
    <main className="bg-surface-low min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="material-symbols-outlined text-[64px] text-outline">error_outline</span>
      <p className="text-on-surface-variant text-[16px] max-w-sm text-center">{message ?? 'Something went wrong.'}</p>
      <Link to="/explore" className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-[13px] font-bold">
        Back to Explore
      </Link>
    </main>
  );
}
