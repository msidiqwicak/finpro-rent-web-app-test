export declare const createBookingProcess: (userId: string, roomTypeId: string, checkIn: Date, checkOut: Date) => Promise<{
    check_out: Date;
    check_in: Date;
    id: string;
    created_at: Date;
    user_id: string;
    status: import("../generated/prisma/index.js").$Enums.booking_status_enum;
    total_price: import("@prisma/client-runtime-utils").Decimal;
    expires_at: Date;
    room_unit_id: string;
}>;
export declare const getBookingDetails: (id: string) => Promise<({
    room_unit: {
        room_type: {
            property: {
                id: string;
                name: string;
                created_at: Date;
                updated_at: Date;
                image_url: string | null;
                description: string | null;
                tenant_id: string;
                category_id: string | null;
                address: string;
                city: string;
                province: string;
                latitude: number | null;
                longitude: number | null;
                deleted_at: Date | null;
            };
        } & {
            id: string;
            name: string;
            property_id: string;
            description: string | null;
            price_per_night: import("@prisma/client-runtime-utils").Decimal;
            capacity: number;
            total_units: number;
            amenities: string[];
            image_urls: string[];
        };
    } & {
        id: string;
        room_type_id: string;
        unit_number: string;
        is_active: boolean | null;
    };
} & {
    check_out: Date;
    check_in: Date;
    id: string;
    created_at: Date;
    user_id: string;
    status: import("../generated/prisma/index.js").$Enums.booking_status_enum;
    total_price: import("@prisma/client-runtime-utils").Decimal;
    expires_at: Date;
    room_unit_id: string;
}) | null>;
export declare const cancelBookingById: (id: string) => Promise<{
    check_out: Date;
    check_in: Date;
    id: string;
    created_at: Date;
    user_id: string;
    status: import("../generated/prisma/index.js").$Enums.booking_status_enum;
    total_price: import("@prisma/client-runtime-utils").Decimal;
    expires_at: Date;
    room_unit_id: string;
}>;
export declare const getAllBookings: (userId: string, search?: string, date?: string) => Promise<({
    room_unit: {
        room_type: {
            property: {
                id: string;
                name: string;
                created_at: Date;
                updated_at: Date;
                image_url: string | null;
                description: string | null;
                tenant_id: string;
                category_id: string | null;
                address: string;
                city: string;
                province: string;
                latitude: number | null;
                longitude: number | null;
                deleted_at: Date | null;
            };
        } & {
            id: string;
            name: string;
            property_id: string;
            description: string | null;
            price_per_night: import("@prisma/client-runtime-utils").Decimal;
            capacity: number;
            total_units: number;
            amenities: string[];
            image_urls: string[];
        };
    } & {
        id: string;
        room_type_id: string;
        unit_number: string;
        is_active: boolean | null;
    };
} & {
    check_out: Date;
    check_in: Date;
    id: string;
    created_at: Date;
    user_id: string;
    status: import("../generated/prisma/index.js").$Enums.booking_status_enum;
    total_price: import("@prisma/client-runtime-utils").Decimal;
    expires_at: Date;
    room_unit_id: string;
})[]>;
export declare const getBookingsByTenant: (tenantId: string, search?: string, status?: string) => Promise<({
    users: {
        email: string;
        name: string;
    };
    room_unit: {
        room_type: {
            property: {
                id: string;
                name: string;
                created_at: Date;
                updated_at: Date;
                image_url: string | null;
                description: string | null;
                tenant_id: string;
                category_id: string | null;
                address: string;
                city: string;
                province: string;
                latitude: number | null;
                longitude: number | null;
                deleted_at: Date | null;
            };
        } & {
            id: string;
            name: string;
            property_id: string;
            description: string | null;
            price_per_night: import("@prisma/client-runtime-utils").Decimal;
            capacity: number;
            total_units: number;
            amenities: string[];
            image_urls: string[];
        };
    } & {
        id: string;
        room_type_id: string;
        unit_number: string;
        is_active: boolean | null;
    };
    payment: {
        id: string;
        status: import("../generated/prisma/index.js").$Enums.payment_status_enum;
        confirmed_at: Date | null;
        booking_id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("../generated/prisma/index.js").$Enums.payment_method_enum;
        proof_url: string | null;
    }[];
} & {
    check_out: Date;
    check_in: Date;
    id: string;
    created_at: Date;
    user_id: string;
    status: import("../generated/prisma/index.js").$Enums.booking_status_enum;
    total_price: import("@prisma/client-runtime-utils").Decimal;
    expires_at: Date;
    room_unit_id: string;
})[]>;
//# sourceMappingURL=booking.service.d.ts.map