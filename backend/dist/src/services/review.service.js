import { prisma } from "../utils/prisma.js";
// 1. TAMU MEMBERIKAN REVIEW
export const createPropertyReview = async (userId, bookingId, rating, comment) => {
    // Ambil data booking beserta relasinya untuk mendapatkan property_id
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            room_unit: {
                include: {
                    room_type: true,
                },
            },
        },
    });
    if (!booking)
        throw new Error("Pesanan tidak ditemukan.");
    if (booking.user_id !== userId)
        throw new Error("Akses ditolak. Ini bukan pesanan Anda.");
    if (booking.status !== "CONFIRMED")
        throw new Error("Anda hanya bisa mereview pesanan yang sukses.");
    // VALIDASI WAKTU: Harus setelah check-out
    const sekarang = new Date();
    const tanggalCheckOut = new Date(booking.check_out);
    if (sekarang < tanggalCheckOut) {
        throw new Error("Anda baru bisa memberikan review setelah melewati tanggal check-out.");
    }
    // CREATE REVIEW (Aman dari duplikat karena @unique di schema Prisma)
    return await prisma.review.create({
        data: {
            booking_id: bookingId,
            user_id: userId,
            property_id: booking.room_unit.room_type.property_id, // Ambil ID properti dari relasi kamar
            rating,
            comment,
        },
    });
};
// 2. TENANT MEMBALAS REVIEW
export const replyPropertyReview = async (tenantUserId, reviewId, replyText) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: {
            property: {
                include: {
                    tenant: true,
                },
            },
        },
    });
    if (!review)
        throw new Error("Review tidak ditemukan.");
    // Validasi keamanan: Pastikan yang membalas adalah Tenant pemilik properti
    if (review.property.tenant.user_id !== tenantUserId) {
        throw new Error("Akses ditolak. Anda bukan pemilik properti ini.");
    }
    // UPDATE menggunakan nama kolom `tenant_reply` sesuai skema-mu
    return await prisma.review.update({
        where: { id: reviewId },
        data: { tenant_reply: replyText },
    });
};
export const getTenantReviews = async (userId) => {
    // 1. Cari data tenant berdasarkan user yang login
    const tenant = await prisma.tenant.findUnique({
        where: { user_id: userId },
    });
    if (!tenant)
        throw new Error("Akses ditolak. Anda bukan tenant.");
    // 2. Ambil semua review yang tertuju pada properti milik tenant ini
    return await prisma.review.findMany({
        where: {
            property: {
                tenant_id: tenant.id,
            },
        },
        include: {
            // Ambil data tamu untuk foto & nama
            users: {
                select: { name: true, avatar_url: true },
            },
            // Ambil data properti agar tenant tahu ulasan ini untuk properti yang mana
            property: {
                select: { name: true },
            },
        },
        orderBy: {
            created_at: "desc", // Urutkan dari ulasan yang paling baru
        },
    });
};
//# sourceMappingURL=review.service.js.map