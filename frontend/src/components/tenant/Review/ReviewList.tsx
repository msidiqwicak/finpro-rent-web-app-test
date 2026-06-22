
import TenantReviewCard from "./TenantReviewCard"; // Pastikan path ini benar

interface ReviewListProps {
  reviews: any[];
  isLoading: boolean;
  onReplySuccess: () => void;
}

export default function ReviewList({
  reviews,
  isLoading,
  onReplySuccess,
}: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-on-surface-variant animate-pulse">
          Memuat ulasan tamu...
        </p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-white rounded-3xl border border-dashed border-outline-variant/50 shadow-sm">
        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-4xl text-outline-variant">
            rate_review
          </span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">
          Belum ada ulasan
        </h3>
        <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
          Properti Anda belum menerima ulasan dari tamu. Ulasan akan muncul di
          sini setelah tamu menyelesaikan masa inapnya.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {reviews.map((review) => (
        <TenantReviewCard
          key={review.id}
          review={review}
          onReplySuccess={onReplySuccess}
        />
      ))}
    </div>
  );
}
