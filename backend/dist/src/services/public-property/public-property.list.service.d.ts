import type { ListFilters } from "./public-property.types.js";
export declare const listProperties: (filters?: ListFilters) => Promise<({
    room_type: {
        id: string;
        name: string;
        price_per_night: import("@prisma/client-runtime-utils").Decimal;
        image_urls: string[];
    }[];
    property_category: {
        id: string;
        name: string;
        tenant_id: string;
    } | null;
} & {
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
})[]>;
export declare const getPropertyDetails: (propertyId: string, targetDateStr?: string) => Promise<{
    room_type: {
        price_per_night: number;
        adjusted_price: number;
        price_modifiers: {
            id: string;
            room_type_id: string;
            start_date: Date;
            end_date: Date;
            modifier_type: import("../../generated/prisma/index.js").$Enums.modifier_type_enum;
            modifier_value: import("@prisma/client-runtime-utils").Decimal;
            is_available: boolean | null;
            reason: string | null;
        }[];
        price_modifier: {
            id: string;
            room_type_id: string;
            start_date: Date;
            end_date: Date;
            modifier_type: import("../../generated/prisma/index.js").$Enums.modifier_type_enum;
            modifier_value: import("@prisma/client-runtime-utils").Decimal;
            is_available: boolean | null;
            reason: string | null;
        }[];
        id: string;
        name: string;
        property_id: string;
        description: string | null;
        capacity: number;
        total_units: number;
        amenities: string[];
        image_urls: string[];
        deleted_at: Date | null;
    }[];
    review: ({
        users: {
            name: string;
            avatar_url: string | null;
        };
    } & {
        id: string;
        user_id: string;
        created_at: Date;
        property_id: string;
        booking_id: string;
        rating: number;
        comment: string | null;
        tenant_reply: string | null;
    })[];
    tenant: {
        id: string;
        users: {
            name: string;
            avatar_url: string | null;
        };
    };
    property_category: {
        id: string;
        name: string;
        tenant_id: string;
    } | null;
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
}>;
//# sourceMappingURL=public-property.list.service.d.ts.map