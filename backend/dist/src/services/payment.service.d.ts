export declare const processPaymentUpload: (bookingId: string, amount: number, method: any, proofUrl: string) => Promise<[{
    id: string;
    status: import("../generated/prisma/index.js").$Enums.payment_status_enum;
    booking_id: string;
    amount: import("@prisma/client-runtime-utils").Decimal;
    method: import("../generated/prisma/index.js").$Enums.payment_method_enum;
    proof_url: string | null;
    confirmed_at: Date | null;
}, {
    id: string;
    user_id: string;
    room_unit_id: string;
    check_in: Date;
    check_out: Date;
    total_price: import("@prisma/client-runtime-utils").Decimal;
    status: import("../generated/prisma/index.js").$Enums.booking_status_enum;
    expires_at: Date;
    created_at: Date;
    is_reminder_sent: boolean;
}]>;
//# sourceMappingURL=payment.service.d.ts.map