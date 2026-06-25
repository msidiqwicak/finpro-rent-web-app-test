export interface PriceModifier {
    start_date: string | Date;
    end_date: string | Date;
    reason?: string | null;
}
export interface BookingData {
    id: string;
    users?: {
        name: string;
    } | null;
    room_unit: {
        room_type: {
            property: {
                name: string;
            };
        };
    } | null;
}
//# sourceMappingURL=booking.type.d.ts.map