import { prisma } from "../utils/prisma.js";
// Asumsi kamu sudah punya layanan email, kita panggil di sini
import { sendConfirmationEmail } from "./email.service.js";
// 1. Tenant Menerima Pembayaran Manual
export const approvePaymentProcess = async (bookingId) => {
    const result = await prisma.$transaction(async (tx) => {
        // Ubah status booking menjadi CONFIRMED
        const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
            include: {
                users: true,
                room_unit: { include: { room_type: { include: { property: true } } } },
            },
        });
        // Ubah status tabel payment menjadi CONFIRMED
        await tx.payment.updateMany({
            where: { booking_id: bookingId, status: "SUBMITTED" },
            data: { status: "CONFIRMED", confirmed_at: new Date() },
        });
        return updatedBooking;
    });
    // 📧 Eksekusi Poin: Kirim email notifikasi & tata cara setelah dikonfirmasi
    if (result) {
        await sendConfirmationEmail(result.users.email, result);
    }
    return result;
};
// 2. Tenant Menolak Pembayaran Manual
export const rejectPaymentProcess = async (bookingId) => {
    return await prisma.$transaction(async (tx) => {
        // Kembalikan status booking ke WAITING_FOR_PAYMENT
        const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: { status: "WAITING_FOR_PAYMENT" },
        });
        // Tandai bukti transfer yang diunggah sebelumnya sebagai REJECTED
        await tx.payment.updateMany({
            where: { booking_id: bookingId, status: "SUBMITTED" },
            data: { status: "REJECTED" },
        });
        return updatedBooking;
    });
};
// 3. Tenant Membatalkan Pesanan Secara Sepihak
export const cancelBookingByTenantProcess = async (bookingId) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { payment: true },
    });
    if (!booking)
        throw new Error("Pesanan tidak ditemukan");
    // 🚨 Eksekusi Poin: Hanya bisa dibatalkan jika bukti pembayaran BELUM diunggah
    // (Asumsi: jika ada payment dengan status SUBMITTED/CONFIRMED, berarti tidak boleh dibatalkan)
    const hasUploadedPayment = booking.payment.some((p) => p.status === "SUBMITTED" || p.status === "CONFIRMED");
    if (hasUploadedPayment) {
        throw new Error("Tidak dapat membatalkan pesanan. User sudah mengunggah bukti pembayaran.");
    }
    return await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELED" },
    });
};
export const getBookingsByTenant = async (tenantId, search, status) => {
    // 1. KUNCI UTAMA KEPEMILIKAN: Memfilter lewat relasi table dari Booking sampai ke Properti Tenant
    const whereClause = {
        room_unit: {
            room_type: {
                property: {
                    tenant_id: tenantId, // 👈 Catatan: Sesuaikan jika di model properti milikmu nama kolomnya 'user_id' atau 'tenantId'
                },
            },
        },
    };
    // 2. Filter berdasarkan Status jika Tenant memilih filter tertentu (selain "Semua")
    if (status && status.trim() !== "" && status !== "Semua") {
        whereClause.status = status;
    }
    // 3. Filter berdasarkan Pencarian Nama Tamu (jika ada input text)
    if (search && search.trim() !== "") {
        whereClause.users = {
            name: {
                contains: search,
                mode: "insensitive", // Ignore huruf besar/kecil
            },
        };
    }
    return await prisma.booking.findMany({
        where: whereClause,
        orderBy: {
            created_at: "desc",
        },
        include: {
            users: {
                select: {
                    name: true,
                    email: true,
                },
            },
            room_unit: {
                include: {
                    room_type: {
                        include: {
                            property: true, // Untuk menampilkan nama properti di tabel tenant
                        },
                    },
                },
            },
            payment: {
                orderBy: { confirmed_at: "desc" },
                take: 1, // Mengambil data payment terakhir untuk ditampilkan foto bukti transfernya di modal
            },
        },
    });
};
//# sourceMappingURL=tenant.service.js.map