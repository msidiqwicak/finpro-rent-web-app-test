export declare const getStayDates: (checkIn: Date, checkOut: Date) => import("date-fns").EachDayOfIntervalResult<{
    start: Date;
    end: Date;
}, undefined>;
export declare const calculateNightlyPrice: (basePrice: number, date: Date, modifiers: any[]) => number;
export declare const verifyBookingOwnership: (bookingId: string, userId: string) => Promise<boolean>;
//# sourceMappingURL=booking.helpers.d.ts.map