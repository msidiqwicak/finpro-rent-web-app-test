import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../api/axiosConfig";
import PropertyCard from "./PropertyCard";
import GuestCard from "./GuestCard";
import PaymentProofViewer from "./PaymentProofViewer";

export default function ConfirmedBooking() {
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
        console.error("Failed to fetch order details:", error);
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

  if (!bookingData) {
    return (
      <div className="w-full text-center py-20 text-on-surface-variant">
        Order data not found.
      </div>
    );
  }

  const shortId = id?.substring(0, 8).toUpperCase();
  const guestName = bookingData.users?.name || "Guest";
  const propertyName =
    bookingData.room_unit?.room_type?.property?.name || "Evergreen Property";
  const locationCity =
    bookingData.room_unit?.room_type?.property?.city || "Location";
  const basePrice = Number(bookingData.total_price);
  const paymentInfo =
    bookingData.payment && bookingData.payment.length > 0
      ? bookingData.payment[0]
      : null;

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
            <h2 className="font-headline-md text-3xl font-semibold text-primary">
              Booking Confirmed
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>
              Confirmed
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
        {/* Left Column: Property, Guest & Banner */}
        <div className="lg:col-span-2 space-y-8">
          {/* Reusable Property Card */}
          <PropertyCard
            propertyName={propertyName}
            locationCity={locationCity}
            imageUrl={bookingData.room_unit?.room_type?.property?.image_url}
            createdAt={bookingData.created_at}
            checkIn={bookingData.check_in}
            checkOut={bookingData.check_out}
          />

          {/* Reusable Guest Card */}
          <GuestCard
            guestName={guestName}
            guestEmail={bookingData.users?.email}
          />

          {/* Success Banner */}
          <section className="bg-green-50 rounded-[32px] p-6 border border-green-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined text-2xl">
                verified
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-green-900">
                Payment Successful
              </h4>
              <p className="text-sm text-green-800">
                The guest has paid for this booking. You can now prepare for
                their arrival.
              </p>
            </div>
          </section>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-8">
          <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_8px_24px_-4px_rgba(27,48,34,0.06)] border border-surface-container">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-6">
              Payment Summary
            </h3>

            {/* Payment Proof Viewer Component */}
            {paymentInfo ? (
              <PaymentProofViewer
                method={paymentInfo.method}
                proofUrl={paymentInfo.proof_url}
              />
            ) : (
              <p className="text-sm text-on-surface-variant mb-6 italic">
                No payment data recorded yet.
              </p>
            )}

            {/* Menambahkan pembatas border-t agar seragam dengan halaman lain */}
            <div className="pt-6 border-t border-outline-variant flex justify-between items-center mb-8">
              <span className="text-xl font-semibold text-primary">
                Total Paid
              </span>
              <span className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(basePrice)}
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
