export declare const getTenantProfile: (userId: string) => Promise<{
    id: string;
    name: string;
    user_id: string;
    created_at: Date;
    image_url: string | null;
}>;
export declare const getAllConfirmedBookings: (tenantId: string) => Promise<{
    total_price: import("@prisma/client-runtime-utils").Decimal;
    created_at: Date;
    room_unit: {
        room_type: {
            property: {
                id: string;
                name: string;
                image_urls: string[];
                city: string;
            };
        };
    };
}[]>;
export declare const getActiveBookingsCount: (tenantId: string, now: Date) => Promise<number>;
export declare const getUpcomingCheckins: (tenantId: string, now: Date) => Promise<({
    room_unit: {
        room_type: {
            property: {
                id: string;
                name: string;
                created_at: Date;
                updated_at: Date;
                description: string | null;
                image_urls: string[];
                deleted_at: Date | null;
                tenant_id: string;
                category_id: string | null;
                address: string;
                city: string;
                province: string;
                latitude: number | null;
                longitude: number | null;
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
            deleted_at: Date | null;
        };
    } & {
        id: string;
        room_type_id: string;
        unit_number: string;
        is_active: boolean | null;
    };
    users: {
        id: string;
        email: string;
        name: string;
        created_at: Date;
        password_hash: string | null;
        is_verified: boolean | null;
        phone: string | null;
        avatar_url: string | null;
        updated_at: Date;
    };
} & {
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
})[]>;
//# sourceMappingURL=dashboard.query.service.d.ts.map