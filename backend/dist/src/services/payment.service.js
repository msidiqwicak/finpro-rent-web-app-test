import { prisma } from "../utils/prisma.js";
// Transaksi DB untuk menjamin kedua proses sukses atau gagal bersamaan
export const processPaymentUpload = async (bookingId, amount, method, proofUrl) => {
    return await prisma.$transaction([
        prisma.payment.create({
            data: {
                booking_id: bookingId,
                amount,
                method,
                proof_url: proofUrl,
                status: "SUBMITTED",
            },
        }),
        prisma.booking.update({
            where: { id: bookingId },
            data: { status: "WAITING_FOR_CONFIRMATION" },
        }),
    ]);
};
//# sourceMappingURL=payment.service.js.map