import { createPropertyReview, replyPropertyReview, getTenantReviews, } from "../services/review.service.js";
export const submitReview = async (req, res) => {
    try {
        const userId = req.user?.id; // Dari JWT
        const { bookingId, rating, comment } = req.body;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized." });
        const review = await createPropertyReview(userId, bookingId, Number(rating), comment);
        res.status(201).json({ message: "Review berhasil dikirim!", data: review });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const submitReply = async (req, res) => {
    try {
        const tenantUserId = req.user?.id;
        const { reviewId } = req.params;
        const { reply } = req.body;
        if (!tenantUserId) {
            return res.status(401).json({ error: "Unauthorized." });
        }
        // 👇 TAMBAHKAN VALIDASI INI UNTUK MEMBUNGKAM TYPESCRIPT 👇
        if (!reviewId || typeof reviewId !== "string") {
            return res.status(400).json({ error: "ID Review tidak valid." });
        }
        if (!reply || typeof reply !== "string") {
            return res
                .status(400)
                .json({ error: "Format balasan tidak valid atau kosong." });
        }
        // 👆 =================================================== 👆
        // Sekarang TypeScript tahu 100% bahwa reviewId dan reply adalah sebuah "string"
        const updatedReview = await replyPropertyReview(tenantUserId, reviewId, reply);
        res
            .status(200)
            .json({ message: "Review berhasil dibalas!", data: updatedReview });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const fetchTenantReviews = async (req, res) => {
    try {
        const userId = req.user?.id; // Diambil dari token JWT
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized." });
        }
        const reviews = await getTenantReviews(userId);
        res.status(200).json({ data: reviews });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//# sourceMappingURL=review.controller.js.map