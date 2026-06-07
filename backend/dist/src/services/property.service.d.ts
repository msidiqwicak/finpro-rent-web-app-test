import type { modifier_type_enum } from '../generated/prisma/index.js';
type CreatePropertyInput = {
    name: string;
    description?: string;
    address: string;
    city: string;
    province: string;
    category_id?: string;
    latitude?: number;
    longitude?: number;
};
type UpdatePropertyInput = Partial<Omit<CreatePropertyInput, 'name'>> & {
    name?: string;
};
export declare const getMyProperties: (userId: string) => Promise<({
    property_category: {
        id: string;
        name: string;
        tenant_id: string;
    } | null;
    room_type: {
        id: string;
        name: string;
        property_id: string;
        description: string | null;
        price_per_night: import("@prisma/client-runtime-utils").Decimal;
        capacity: number;
        total_units: number;
        amenities: string[];
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
export declare const createProperty: (userId: string, data: CreatePropertyInput) => Promise<{
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
export declare const updateProperty: (userId: string, propertyId: string, data: UpdatePropertyInput) => Promise<{
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
export declare const deleteProperty: (userId: string, propertyId: string) => Promise<{
    message: string;
}>;
type PriceModifierInput = {
    startDate: string;
    endDate: string;
    type: modifier_type_enum;
    value: number;
    reason?: string;
};
export declare const setPriceModifier: (userId: string, roomTypeId: string, input: PriceModifierInput) => Promise<{
    id: string;
    room_type_id: string;
    start_date: Date;
    end_date: Date;
    modifier_type: import("../generated/prisma/index.js").$Enums.modifier_type_enum;
    modifier_value: import("@prisma/client-runtime-utils").Decimal;
    is_available: boolean | null;
    reason: string | null;
}>;
export declare const deletePriceModifier: (userId: string, modifierId: string) => Promise<{
    message: string;
}>;
export {};
//# sourceMappingURL=property.service.d.ts.map