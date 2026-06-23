import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import api from "../../api/axiosConfig";

import type {
  PropertyDetail,
  RoomType,
} from "../../components/property-detail/types";
import { PLACEHOLDER } from "../../components/property-detail/utils";
import PropertyGallery from "../../components/property-detail/PropertyGallery";
import PropertyAmenities from "../../components/property-detail/PropertyAmenities";
import RoomTypeList from "../../components/property-detail/RoomTypeList";
import BookingWidget from "../../components/property-detail/BookingWidget";
import {
  LoadingSkeleton,
  ErrorState,
} from "../../components/property-detail/PropertyDetailStates";
import PropertyReviews from "../../components/users/property/PropertyReview";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        if (!property) setIsLoading(true);
        const url = checkin
          ? `/properties/${id}?date=${checkin}`
          : `/properties/${id}`;
        const res = await api.get(url);
        const data = res.data.data ?? res.data;
        setProperty(data);

        if (selectedRoom) {
          const updatedRoom = data.room_type?.find(
            (rt: RoomType) => rt.id === selectedRoom.id,
          );
          if (updatedRoom) setSelectedRoom(updatedRoom);
        } else if (data.room_type?.length > 0) {
          setSelectedRoom(data.room_type[0]);
        }
      } catch (err: unknown) {
        const errorMessage =
          typeof err === "object" && err !== null && "response" in err
            ? (err as { response?: { data?: { error?: string } } }).response
                ?.data?.error
            : null;
        setError(errorMessage ?? "Properti tidak ditemukan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, checkin]);

  const handleBookNow = () => {
    if (!selectedRoom || !checkin || !checkout) return;
    const params = new URLSearchParams();
    params.set("roomTypeId", selectedRoom.id);
    params.set("checkin", checkin);
    params.set("checkout", checkout);
    params.set("guests", String(guests));
    navigate(`/checkout/${id}?${params.toString()}`, {
      state: {
        checkIn: checkin,
        checkOut: checkout,
        roomName: selectedRoom.name,
        pricePerNight: selectedRoom.adjusted_price,
      },
    });
  };

  if (isLoading)
    return (
      <>
        <Navbar />
        <LoadingSkeleton />
        <Footer />
      </>
    );
  if (error || !property)
    return (
      <>
        <Navbar />
        <ErrorState message={error} />
        <Footer />
      </>
    );

  const allImages = [
    ...(property.image_urls || []),
    ...property.room_type.flatMap((rt) => rt.image_urls),
  ].filter(Boolean) as string[];
  if (allImages.length === 0) allImages.push(PLACEHOLDER);

  const allAmenities = [
    ...new Set(property.room_type.flatMap((rt) => rt.amenities)),
  ];
  const maxCapacity = Math.max(
    ...property.room_type.map((rt) => rt.capacity),
    1,
  );
  const category = property.property_category?.name ?? "Property";

  return (
    <>
      <Navbar />
      <main className="bg-surface-low min-h-screen">
        <div className="max-w-[1280px] mx-auto px-5 pt-6 pb-16 md:px-8 lg:px-16">
          <nav className="flex items-center gap-2 text-[13px] text-on-surface-variant mb-5 flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <Link
              to="/explore"
              className="hover:text-primary transition-colors"
            >
              Explore
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span className="text-on-surface font-semibold truncate max-w-[200px]">
              {property.name}
            </span>
          </nav>

          <div className="mb-6">
            <h1 className="font-display text-[clamp(22px,3.5vw,32px)] font-bold text-on-surface mb-2">
              {property.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-[14px] text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  location_on
                </span>
                {property.address}, {property.city}, {property.province}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[12px] font-bold">
                <span className="material-symbols-outlined text-[14px] [font-variation-settings:'FILL'_1]">
                  eco
                </span>
                {category}
              </span>
            </div>
          </div>

          <PropertyGallery images={allImages} propertyName={property.name} />

          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 pb-6 border-b border-outline-variant/50 mb-6">
                <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-primary/20">
                  {property.tenant.image_url ? (
                    <img
                      src={property.tenant.image_url}
                      alt={property.tenant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[28px] text-on-surface-variant">
                      person
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-display font-bold text-[17px] text-on-surface">
                    Hosted by {property.tenant.name}
                  </p>
                  <p className="text-[13px] text-on-surface-variant">
                    {category} · Up to {maxCapacity} guests ·{" "}
                    {property.room_type.length} room type
                    {property.room_type.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {property.description && (
                <div className="mb-8">
                  <h2 className="font-display font-bold text-[20px] text-on-surface mb-3">
                    About this place
                  </h2>
                  <p className="text-[15px] text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}

              <PropertyAmenities amenities={allAmenities} />

              <RoomTypeList
                roomTypes={property.room_type}
                selectedRoom={selectedRoom}
                onSelectRoom={setSelectedRoom}
              />

              <div className="pb-8 border-b border-outline-variant/50">
                <h2 className="font-display font-bold text-[20px] text-on-surface mb-3">
                  Location
                </h2>
                <p className="text-[15px] text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">
                    map
                  </span>
                  {property.address}, {property.city}, {property.province}
                </p>
              </div>
            </div>

            <BookingWidget
              selectedRoom={selectedRoom}
              checkin={checkin}
              checkout={checkout}
              guests={guests}
              showCalendar={showCalendar}
              onSetCheckin={setCheckin}
              onSetCheckout={setCheckout}
              onSetGuests={setGuests}
              onToggleCalendar={() => setShowCalendar((s) => !s)}
              onCloseCalendar={() => setShowCalendar(false)}
              onBookNow={handleBookNow}
            />
          </div>

          {/* 👇 SISIPKAN BAGIAN REVIEW DI BAWAH SINI 👇 */}
          {property && (
            <section className="mt-16 pt-8 border-t border-outline-variant">
              <h2 className="font-headline-sm text-2xl font-bold text-primary">
                Guest Reviews
              </h2>
              <PropertyReviews reviews={property.review || []} />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
