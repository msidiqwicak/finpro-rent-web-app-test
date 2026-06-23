// 1. Interface untuk Booking (Level Terdalam)
export interface CalendarBooking {
  id: string;
  check_in: Date;
  check_out: Date;
  users: {
    name: string;
  };
}

// 2. Interface untuk Room Unit
export interface CalendarRoomUnit {
  id: string;
  unit_number: string;
  booking: CalendarBooking[];
}

// 3. Interface untuk Room Type
export interface CalendarRoomType {
  id: string;
  name: string;
  capacity: number;
  room_unit: CalendarRoomUnit[];
}

// 4. Interface Utama untuk Property (Level Terluar)
export interface CalendarProperty {
  id: string;
  name: string;
  room_type: CalendarRoomType[];
}
