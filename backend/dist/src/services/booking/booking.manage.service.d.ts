export declare const cancelBookingById: (id: string) => Promise<{
    id: string;
    user_id: string;
    room_unit_id: string;
    check_in: Date;
    check_out: Date;
    total_price: import("@prisma/client-runtime-utils").Decimal;
    status: import("../../generated/prisma/index.js").$Enums.booking_status_enum;
    expires_at: Date;
    created_at: Date;
    is_reminder_sent: boolean;
}>;
//# sourceMappingURL=booking.manage.service.d.ts.map