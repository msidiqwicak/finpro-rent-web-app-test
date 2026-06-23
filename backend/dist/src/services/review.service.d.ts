export declare const createPropertyReview: (userId: string, bookingId: string, rating: number, comment: string) => Promise<{
    id: string;
    user_id: string;
    created_at: Date;
    property_id: string;
    booking_id: string;
    rating: number;
    comment: string | null;
    tenant_reply: string | null;
}>;
export declare const replyPropertyReview: (tenantUserId: string, reviewId: string, replyText: string) => Promise<{
    id: string;
    user_id: string;
    created_at: Date;
    property_id: string;
    booking_id: string;
    rating: number;
    comment: string | null;
    tenant_reply: string | null;
}>;
export declare const getTenantReviews: (userId: string) => Promise<({
    users: {
        name: string;
        avatar_url: string | null;
    };
    property: {
        name: string;
    };
} & {
    id: string;
    user_id: string;
    created_at: Date;
    property_id: string;
    booking_id: string;
    rating: number;
    comment: string | null;
    tenant_reply: string | null;
})[]>;
//# sourceMappingURL=review.service.d.ts.map