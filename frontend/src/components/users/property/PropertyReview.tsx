interface ReviewUser {
  name: string;
  avatar_url?: string | null;
}

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  tenant_reply: string | null;
  created_at: string;
  users: ReviewUser;
}

interface PropertyReviewsProps {
  reviews: ReviewData[];
}

export default function PropertyReviews({ reviews }: PropertyReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant text-center mt-8">
        <h3 className="font-headline-sm text-xl font-bold text-primary mb-2">
          No reviews yet
        </h3>
        <p className="text-on-surface-variant text-sm">
          Be the first guest to stay and share your experience here!
        </p>
      </div>
    );
  }

  // Hitung rata-rata rating
  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="mt-12">
      {/* Header Statistik */}
      <div className="flex items-center gap-4 mb-8">
        <span
          className="material-symbols-outlined text-secondary text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
        <div>
          <h2 className="font-headline-md text-2xl font-bold text-primary">
            {averageRating}{" "}
            <span className="text-on-surface-variant font-normal text-lg">
              / 5.0
            </span>
          </h2>
          <p className="text-on-surface-variant text-sm">
            Based on {reviews.length} {reviews.length === 1 ? 'guest review' : 'guest reviews'}
          </p>
        </div>
      </div>

      {/* Daftar Ulasan (Grid 2 Kolom untuk desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/50 flex flex-col h-full"
          >
            {/* Reviewer Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant shrink-0">
                  <img
                    src={
                      review.users?.avatar_url ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(review.users?.name || "User")}`
                    }
                    alt="Reviewer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-primary">
                    {review.users?.name || "Guest"}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {/* Bintang Rating */}
              <div className="flex text-secondary text-sm">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[16px]"
                    style={{
                      fontVariationSettings:
                        i < review.rating ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>

            {/* Komentar Tamu */}
            <p className="text-on-surface-variant text-sm leading-relaxed mb-4 flex-grow">
              {review.comment || (
                <span className="italic opacity-70">
                  Guest left a rating without a comment.
                </span>
              )}
            </p>

            {/* Balasan Tenant (Jika Ada) */}
            {review.tenant_reply && (
              <div className="mt-auto pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-secondary text-[14px]">
                    reply
                  </span>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">
                    Host Reply
                  </p>
                </div>
                <p className="text-sm text-on-surface-variant bg-surface-container-lowest p-3 rounded-lg border-l-2 border-primary">
                  {review.tenant_reply}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
