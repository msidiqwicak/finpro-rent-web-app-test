import { prisma } from "../utils/prisma.js";
export type TransactionContext = Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;
export interface PaymentItem {
    id?: string;
    status: string;
    booking_id?: string;
    confirmed_at?: Date | null;
}
//# sourceMappingURL=tenant.type.d.ts.map