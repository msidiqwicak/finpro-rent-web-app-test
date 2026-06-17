import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import TenantLayout from "../../components/layout/TenantLayout";
import ReviewFilterBar from "../../components/tenant/Review/ReviewFilterBar";
import ReviewList from "../../components/tenant/Review/ReviewList";

export default function TenantReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/reviews/tenant");
      setReviews(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil ulasan", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <TenantLayout
      title="Guest Reviews"
      subtitle="View and manage feedback from your guests."
    >
      <div className="w-full animate-fade-in flex flex-col">
        {/* Filter Section Component */}
        <ReviewFilterBar reviewCount={reviews.length} />

        {/* Reviews List Component */}
        <ReviewList
          reviews={reviews}
          isLoading={isLoading}
          onReplySuccess={fetchReviews}
        />
      </div>
    </TenantLayout>
  );
}
