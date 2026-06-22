// Tipe data berdasarkan Prisma Schema yang baru
interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  tenant_reply: string | null;
  created_at: string;
}

interface UserReviewSectionProps {
  status: string;
  checkOutDate: Date;
  review: ReviewData | null | undefined;
  onOpenReviewModal: () => void;
}

export default function UserReviewSection({
  status,
  checkOutDate,
  review,
  onOpenReviewModal,
}: UserReviewSectionProps) {
  const sekarang = new Date();

  // Logika 15 Poin: Bisa review jika status CONFIRMED, sudah lewat check-out, dan belum ada review
  const isEligibleToReview =
    status === "CONFIRMED" && sekarang > checkOutDate && !review;

  // Jika belum saatnya review dan belum ada review, jangan tampilkan kotak ini
  if (!isEligibleToReview && !review) {
    return null;
  }

  return (
    <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/30 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline-sm text-xl font-bold text-primary">
          Your Review
        </h3>

        {/* Tampilkan Bintang Bintang Jika Sudah Ada Review */}
        {review && (
          <div className="flex text-secondary">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-lg"
                style={{
                  fontVariationSettings:
                    i < review.rating ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                star
              </span>
            ))}
          </div>
        )}
      </div>

      {/* STATE 1: Belum Review, tapi sudah memenuhi syarat */}
      {isEligibleToReview && (
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/20 flex flex-col items-center text-center gap-4">
          <p className="text-on-surface-variant font-body-md">
            How was your stay? Share your experience to help others and support
            the host.
          </p>
          <button
            onClick={onOpenReviewModal}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Tulis Ulasan
          </button>
        </div>
      )}

      {/* STATE 2: Sudah Review (Mengikuti desain HTML kamu) */}
      {review && (
        <div className="bg-surface-container-lowest p-6 rounded-lg italic text-on-surface-variant relative shadow-inner">
          <span className="material-symbols-outlined absolute -top-3 -left-1 text-primary-container opacity-20 text-4xl">
            format_quote
          </span>
          <p className="leading-relaxed relative z-10 pl-4 border-l-2 border-primary/20">
            "{review.comment || "Memberikan penilaian tanpa komentar."}"
          </p>
          <p className="not-italic font-label-md text-primary mt-4 text-xs font-bold">
            — Reviewed on{" "}
            {new Date(review.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          {/* Balasan dari Tenant (Jika Ada) */}
          {review.tenant_reply && (
            <div className="mt-4 pt-4 border-t border-outline-variant/30 not-italic">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-secondary text-sm">
                  reply
                </span>
                <span className="font-bold text-xs text-secondary uppercase tracking-wider">
                  Host Reply
                </span>
              </div>
              <p className="text-sm text-on-surface-variant bg-surface-variant/30 p-3 rounded-lg">
                {review.tenant_reply}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
