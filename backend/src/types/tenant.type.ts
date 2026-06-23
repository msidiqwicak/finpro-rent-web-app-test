// File: src/types/tenant.types.ts

// 👇 Import variabel prisma milikmu agar kita bisa "mencuri" tipenya
// (Sesuaikan jumlah "../" dengan lokasi file prisma.js milikmu)
import { prisma } from "../utils/prisma.js";

// 1. Type untuk transaksi Prisma
export type TransactionContext = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

// 2. Interface untuk Payment
export interface PaymentItem {
  id?: string;
  status: string;
  booking_id?: string;
  confirmed_at?: Date | null;
}
