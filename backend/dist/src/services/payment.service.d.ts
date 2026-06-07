export declare const processPaymentUpload: (bookingId: string, amount: number, method: any, proofUrl: string) => Promise<[{
    id: string;
    status: import("../generated/prisma/index.js").$Enums.payment_status_enum;
    confirmed_at: Date | null;
    booking_id: string;
    amount: import("@prisma/client-runtime-utils").Decimal;
    method: import("../generated/prisma/index.js").$Enums.payment_method_enum;
    proof_url: string | null;
}, {
    check_out: Date;
    check_in: Date;
    id: string;
    created_at: Date;
    user_id: string;
    status: import("../generated/prisma/index.js").$Enums.booking_status_enum;
    total_price: import("@prisma/client-runtime-utils").Decimal;
    expires_at: Date;
    room_unit_id: string;
}]>;
//# sourceMappingURL=payment.service.d.ts.map