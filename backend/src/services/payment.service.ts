import { prisma } from "../utils/prisma.js";

// Transaksi DB untuk menjamin kedua proses sukses atau gagal bersamaan
export const processPaymentUpload = async (
  bookingId: string,
  amount: number,
  method: any,
  proofUrl: string,
) => {
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

// Fungsi Ownership: Verifikasi bahwa booking yang dituju milik user yang sedang login
export const verifyPaymentOwnership = async (
  bookingId: string,
  userId: string,
): Promise<boolean> => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { user_id: true },
  });

  if (!booking) {
    throw new Error("Pesanan tidak ditemukan");
  }

  return booking.user_id === userId;
};
