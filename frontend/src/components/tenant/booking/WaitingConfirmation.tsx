import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axiosConfig";
import GuestCard from "./GuestCard";
import PropertyCard from "./PropertyCard";
import PaymentProofViewer from "./PaymentProofViewer";
import ConfirmPaymentModal from "./ConfirmPaymentModal"; // <-- Import Modal-nya

export default function WaitingConfirmation() {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State yang jauh lebih sederhana: hanya true (buka modal) atau false (tutup modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

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

  // Handler diperbarui untuk menerima parameter bookingId dari dalam modal
  const handleApprove = async (bookingId: string) => {
    try {
      setIsProcessing(true);
      await api.patch(`/tenant/bookings/${bookingId}/approve`);
      navigate("/tenant/bookings");
    } catch (error) {
      alert("Failed to approve payment.");
      setIsProcessing(false);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      setIsProcessing(true);
      await api.patch(`/tenant/bookings/${bookingId}/reject`);
      navigate("/tenant/bookings");
    } catch (error) {
      alert("Failed to reject payment.");
      setIsProcessing(false);
    }
  };

  if (isLoading)
    return (
      <div className="w-full flex justify-center items-center py-32">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl">
          autorenew
        </span>
      </div>
    );
  if (!bookingData)
    return (
      <div className="w-full text-center py-20 text-on-surface-variant">
        Order data not found.
      </div>
    );

  const shortId = id?.substring(0, 8).toUpperCase();
  const guestName = bookingData.users?.name || "Guest";
  const propertyName =
    bookingData.room_unit?.room_type?.property?.name || "Evergreen Property";
  const locationCity =
    bookingData.room_unit?.room_type?.property?.city || "Location";
  const paymentInfo = bookingData.payment?.[0] || null;

  return (
    <div className="w-full relative">
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
              Awaiting Confirmation
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-xs rounded-full font-bold">
              Pending Confirmation
            </span>
            <span className="text-on-surface-variant flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-lg">
                receipt_long
              </span>
              Order #{shortId}
            </span>
          </div>
        </div>

        <div className="bg-primary-container/40 rounded-2xl p-4 max-w-xs border border-primary-fixed flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">
            verified_user
          </span>
          <p className="text-xs text-on-primary-fixed-variant leading-tight">
            The guest has completed the payment. Please review the payment proof
            below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <PropertyCard
            propertyName={propertyName}
            locationCity={locationCity}
            imageUrl={bookingData.room_unit?.room_type?.property?.image_url}
            createdAt={bookingData.created_at}
            checkIn={bookingData.check_in}
            checkOut={bookingData.check_out}
          />
          <GuestCard
            guestName={guestName}
            guestEmail={bookingData.users?.email}
          />
        </div>

        <div className="space-y-8">
          <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_8px_24px_-4px_rgba(27,48,34,0.06)] border border-surface-container">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-6">
              Payment Details
            </h3>

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

            <div className="pt-6 border-t border-outline-variant flex justify-between items-center mb-8">
              <span className="text-xl font-semibold text-primary">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(Number(bookingData.total_price))}
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer border-none flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  visibility
                </span>
                Review Payment Receipt
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* MODAL MUNCUL KETIKA TOMBOL DIKLIK */}
      {isModalOpen && (
        <ConfirmPaymentModal
          booking={bookingData}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
