import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../api/axiosConfig";

export default function CanceledBooking() {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/tenant/bookings/${id}`);
        setBookingData(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchBookingDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-32">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl">
          autorenew
        </span>
      </div>
    );
  }

  if (!bookingData)
    return (
      <div className="w-full text-center py-20 text-on-surface-variant">
        Data tidak ditemukan.
      </div>
    );

  const shortId = id?.substring(0, 8).toUpperCase();
  const guestName = bookingData.users?.name || "Tamu";
  const guestInitials = guestName.substring(0, 2).toUpperCase();
  const propertyName =
    bookingData.room_unit?.room_type?.property?.name || "Evergreen Property";
  const locationCity =
    bookingData.room_unit?.room_type?.property?.city || "Lokasi";
  const basePrice = Number(bookingData.total_price);

  return (
    <div className="w-full">
      {/* Order Detail Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/tenant/bookings"
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center"
            >
              <span className="material-symbols-outlined text-[24px]">
                arrow_back
              </span>
            </Link>
            <h2 className="font-headline-md text-3xl font-semibold text-on-surface-variant">
              Canceled Booking
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-xs rounded-full font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">cancel</span>
              Canceled
            </span>
            <span className="text-on-surface-variant flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-lg">
                receipt_long
              </span>
              Order #{shortId}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Property Card */}
          <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_8px_24px_-4px_rgba(27,48,34,0.06)] border border-surface-container opacity-80">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 h-44 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container">
                <img
                  alt={propertyName}
                  className="w-full h-full object-cover grayscale"
                  src={
                    bookingData.room_unit?.room_type?.property?.image_url ||
                    "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070&auto=format&fit=crop"
                  }
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-on-surface-variant mb-1">
                    {propertyName}
                  </h3>
                  <p className="text-on-surface-variant text-sm">
                    {locationCity}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant">
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase font-medium">
                      Check-in
                    </p>
                    <p className="text-sm font-semibold">
                      {bookingData.check_in}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase font-medium">
                      Check-out
                    </p>
                    <p className="text-sm font-semibold">
                      {bookingData.check_out}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Canceled Notice Banner */}
          <section className="bg-surface-container-high rounded-[32px] p-6 border border-outline-variant flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-2xl">
                event_busy
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-on-surface-variant">
                Booking Canceled
              </h4>
              <p className="text-sm text-on-surface-variant">
                This reservation has been terminated. The dates are now
                available for other guests.
              </p>
            </div>
          </section>
        </div>

        {/* Right Column: Details & Archive */}
        <div className="space-y-8">
          <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_8px_24px_-4px_rgba(27,48,34,0.06)] border border-surface-container">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-6">
              Details
            </h3>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-semibold text-on-surface-variant">
                Original Total
              </span>
              <span className="text-2xl font-bold text-on-surface-variant line-through opacity-60">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(basePrice)}
              </span>
            </div>

            <div className="space-y-3">
              <button className="w-full py-4 bg-transparent border border-outline text-on-surface rounded-2xl font-bold text-sm hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">archive</span>
                Archive Order
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
