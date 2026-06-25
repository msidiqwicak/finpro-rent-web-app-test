import type { CreateRoomTypeInput } from "./property.helpers.js";
export declare const createRoomType: (userId: string, propertyId: string, data: CreateRoomTypeInput, files?: Express.Multer.File[]) => Promise<any>;
export declare const updateRoomType: (userId: string, roomTypeId: string, data: any, files?: Express.Multer.File[]) => Promise<any>;
export declare const deleteRoomType: (userId: string, roomTypeId: string) => Promise<{
    message: string;
}>;
//# sourceMappingURL=property.room.service.d.ts.map