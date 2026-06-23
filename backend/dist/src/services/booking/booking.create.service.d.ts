export declare const createBookingProcess: (userId: string, roomTypeId: string, checkIn: Date, checkOut: Date) => Promise<{
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
//# sourceMappingURL=booking.create.service.d.ts.map