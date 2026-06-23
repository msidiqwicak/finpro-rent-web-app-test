import type { CreateRoomTypeInput } from "./property.helpers.js";
export declare const createRoomType: (userId: string, propertyId: string, data: CreateRoomTypeInput, files?: Express.Multer.File[]) => Promise<{
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
export declare const updateRoomType: (userId: string, roomTypeId: string, data: any, files?: Express.Multer.File[]) => Promise<{
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
export declare const deleteRoomType: (userId: string, roomTypeId: string) => Promise<{
    message: string;
}>;
//# sourceMappingURL=property.room.service.d.ts.map