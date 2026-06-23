export declare const getPropertyCalendar: (tenantUserId: string, monthStr: string) => Promise<{
    property_id: string;
    property_name: string;
    room_types: {
        room_type_id: string;
        room_type_name: string;
        capacity: number;
        units: {
            unit_id: string;
            unit_number: string;
            bookings: {
                booking_id: string;
                guest_name: string;
                check_in: Date;
                check_out: Date;
            }[];
        }[];
    }[];
}[]>;
//# sourceMappingURL=report.calendar.service.d.ts.map