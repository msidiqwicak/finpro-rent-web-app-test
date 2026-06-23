import type { CreatePropertyInput } from "./property.helpers.js";
export declare const getMyProperties: (userId: string) => Promise<({
    room_type: ({
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
    })[];
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
export declare const createProperty: (userId: string, data: CreatePropertyInput, files?: Express.Multer.File[]) => Promise<{
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
export declare const updateProperty: (userId: string, propertyId: string, data: any, files?: Express.Multer.File[]) => Promise<{
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
export declare const deleteProperty: (userId: string, propertyId: string) => Promise<{
    message: string;
}>;
//# sourceMappingURL=property.core.service.d.ts.map