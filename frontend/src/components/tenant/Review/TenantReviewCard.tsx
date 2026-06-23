import { useState } from "react";
import api from "../../../api/axiosConfig";

interface TenantReviewCardProps {
  review: any;
  onReplySuccess: () => void;
}

export default function TenantReviewCard({
  review,
  onReplySuccess,
}: TenantReviewCardProps) {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/reviews/${review.id}/reply`, { reply: replyText });
      onReplySuccess();
    } catch (error) {
      alert("Gagal mengirim balasan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const guestName = review.users?.name || "Guest";
  const guestAvatar =
    review.users?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${guestName}`;
  const reviewDate = new Date(review.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    // Padding desktop dikurangi dari md:p-8 menjadi md:p-6
    <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-outline-variant/20 shadow-[0_4px_12px_rgba(27,48,34,0.06)] hover:-translate-y-0.5 transition-transform duration-200">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4 mb-4 md:mb-5">
        {/* KIRI: Avatar, Nama, dan Bintang */}
        <div className="flex items-center gap-3">
          <img
            alt={guestName}
            src={guestAvatar}
            // Ukuran avatar diperkecil (Desktop: w-12, Mobile: w-10)
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-secondary-container object-cover shrink-0"
          />
          <div>
            {/* Ukuran teks nama diperkecil */}
            <h4 className="font-headline-sm text-base md:text-lg font-bold text-primary leading-tight">
              {guestName}
            </h4>
            <div className="flex items-center gap-1 text-secondary mt-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[14px] md:text-[16px]"
                  style={{
                    fontVariationSettings:
                      i < review.rating ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  star
                </span>
              ))}
              <span className="ml-1 font-label-md text-xs md:text-sm text-on-surface-variant font-bold">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* KANAN: Properti & Tanggal */}
        <div className="flex flex-col items-start sm:items-end gap-1 shrink-0 mt-2 sm:mt-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full hover:scale-105 transition-transform max-w-full">
            <span
              className="material-symbols-outlined text-[14px] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
            <span className="text-[10px] md:text-xs font-bold truncate max-w-[180px]">
              {review.property?.name || "Property"}
            </span>
          </div>
          <p className="text-[10px] md:text-xs text-on-surface-variant pl-1 sm:pl-0 mt-0.5">
            Reviewed: {reviewDate}
          </p>
        </div>
      </div>

      {/* Guest Comment */}
      {/* Ukuran teks komentar dikurangi agar lebih hemat ruang */}
      <p className="font-body-lg text-sm md:text-base text-on-surface-variant leading-relaxed mb-5 italic">
        "{review.comment || "Guest did not leave a written comment."}"
      </p>

      {/* Reply Section */}
      {review.tenant_reply ? (
        // STATE 1: ALREADY REPLIED
        <div className="ml-0 md:ml-8 bg-secondary-container/10 rounded-xl p-4 border-l-4 border-secondary">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[16px]">
                verified_user
              </span>
              <span className="font-label-md text-xs md:text-sm font-bold text-primary">
                Host Response
              </span>
            </div>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant">
            "{review.tenant_reply}"
          </p>
        </div>
      ) : (
        // STATE 2: NEEDS REPLY
        <div className="bg-surface-container-low/50 rounded-xl p-4 md:p-5 border border-dashed border-outline-variant">
          <h5 className="font-label-md text-xs md:text-sm font-bold text-primary mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">reply</span>
            Respond to {guestName.split(" ")[0]}
          </h5>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 font-body-md text-sm text-on-surface focus:ring-2 focus:ring-secondary-container focus:border-secondary outline-none transition-all h-20 mb-3 resize-none"
            placeholder="Write your response here..."
          />
          <div className="flex justify-end">
            <button
              onClick={handleReply}
              disabled={isSubmitting || !replyText.trim()}
              className="bg-primary text-on-primary px-5 py-2 rounded-full font-label-md text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
              <span className="material-symbols-outlined text-[16px]">
                send
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
