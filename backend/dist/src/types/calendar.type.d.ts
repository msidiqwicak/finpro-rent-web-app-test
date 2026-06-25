export interface CalendarBooking {
    id: string;
    check_in: Date;
    check_out: Date;
    users: {
        name: string;
    };
}
export interface CalendarRoomUnit {
    id: string;
    unit_number: string;
    booking: CalendarBooking[];
}
export interface CalendarRoomType {
    id: string;
    name: string;
    capacity: number;
    room_unit: CalendarRoomUnit[];
}
export interface CalendarProperty {
    id: string;
    name: string;
    room_type: CalendarRoomType[];
}
//# sourceMappingURL=calendar.type.d.ts.map