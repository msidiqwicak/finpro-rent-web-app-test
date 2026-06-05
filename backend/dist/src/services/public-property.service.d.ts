import { Prisma } from '../generated/prisma/index.js';
export declare const listProperties: (city?: string) => Promise<({
    property_category: {
        id: string;
        name: string;
        tenant_id: string;
    } | null;
    room_type: {
        id: string;
        name: string;
        price_per_night: Prisma.Decimal;
        image_urls: string[];
    }[];
} & {
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
})[]>;
export declare const getPropertyDetails: (propertyId: string, targetDateStr?: string) => Promise<{
    room_type: {
        id: string;
        name: string;
        description: string | null;
        capacity: number;
        total_units: number;
        amenities: string[];
        image_urls: string[];
        price_per_night: number;
        adjusted_price: number;
        price_modifiers: {
            id: string;
            room_type_id: string;
            start_date: Date;
            end_date: Date;
            modifier_type: import("../generated/prisma/index.js").$Enums.modifier_type_enum;
            modifier_value: Prisma.Decimal;
            is_available: boolean | null;
            reason: string | null;
        }[];
    }[];
    tenant: {
        id: string;
        name: string;
        image_url: string | null;
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
}>;
//# sourceMappingURL=public-property.service.d.ts.map