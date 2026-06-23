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
    room_type: any[];
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