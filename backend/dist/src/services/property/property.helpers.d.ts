export type CreatePropertyInput = {
    name: string;
    description?: string;
    address: string;
    city: string;
    province: string;
    category_id?: string;
    latitude?: number;
    longitude?: number;
};
export type CreateRoomTypeInput = {
    name: string;
    description?: string;
    price_per_night: number;
    capacity?: number;
    total_units?: number;
    amenities?: string[];
    image_urls?: string[];
};
export type PriceModifierInput = {
    startDate: string;
    endDate: string;
    type: string;
    value: number;
    reason?: string;
    isAvailable?: boolean;
};
export declare const getTenantId: (userId: string) => Promise<string>;
export declare const assertPropertyOwner: (propertyId: string, tenantId: string) => Promise<{
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
export declare const assertRoomTypeOwner: (roomTypeId: string, tenantId: string) => Promise<{
    property: {
        tenant_id: string;
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
}>;
export declare const parseImages: (dataImages: any, existingImages: string[], files?: Express.Multer.File[]) => string[];
//# sourceMappingURL=property.helpers.d.ts.map