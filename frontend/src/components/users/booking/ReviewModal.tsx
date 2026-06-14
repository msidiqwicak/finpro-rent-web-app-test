// src/components/users/booking/ReviewModal.tsx
import React, { useState } from "react";
import api from "../../../api/axiosConfig";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess: () => void; // Fungsi untuk me-refresh data pesanan setelah sukses
}

export default function ReviewModal({
  isOpen,
  onClose,
  bookingId,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5); // Default rating 5 bintang
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Menembak API Backend yang sudah kita buat sebelumnya
      await api.post("/reviews", {
        bookingId,
        rating,
        comment,
      });
      onSuccess(); // Panggil fungsi refresh
      onClose(); // Tutup modal
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal mengirim ulasan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        {/* Tombol Close (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="font-headline-sm text-2xl font-bold text-primary mb-2">
          Bagaimana pengalaman Anda?
        </h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Penilaian Anda sangat berarti bagi Host dan tamu lainnya.
        </p>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bagian Bintang (Rating) */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <span
                    className={`material-symbols-outlined ${star <= rating ? "text-secondary" : "text-outline-variant"}`}
                    style={{
                      fontVariationSettings:
                        star <= rating ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            <span className="text-sm font-bold text-primary">
              {rating === 1 && "Sangat Buruk"}
              {rating === 2 && "Buruk"}
              {rating === 3 && "Cukup"}
              {rating === 4 && "Bagus"}
              {rating === 5 && "Sangat Memuaskan"}
            </span>
          </div>

          {/* Bagian Komentar */}
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">
              Tulis ulasan Anda (Opsional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan pengalaman Anda menginap di sini..."
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm focus:border-primary focus:outline-none resize-none h-28"
            ></textarea>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </form>
      </div>
    </div>
  );
}
