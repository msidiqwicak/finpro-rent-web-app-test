import type { Request, Response } from 'express';
export declare const getCategories: (req: Request, res: Response) => Promise<void>;
export declare const listProperties: (req: Request, res: Response) => Promise<void>;
export declare const searchProperties: (req: Request, res: Response) => Promise<void>;
export declare const getProperty: (req: Request, res: Response) => Promise<void>;
export declare const getRoomCalendar: (req: Request, res: Response) => Promise<void>;
export declare const getMyProperties: (req: Request, res: Response) => Promise<void>;
export declare const createProperty: (req: Request, res: Response) => Promise<void>;
export declare const updateProperty: (req: Request, res: Response) => Promise<void>;
export declare const deleteProperty: (req: Request, res: Response) => Promise<void>;
export declare const createRoomType: (req: Request, res: Response) => Promise<void>;
export declare const updateRoomType: (req: Request, res: Response) => Promise<void>;
export declare const deleteRoomType: (req: Request, res: Response) => Promise<void>;
export declare const setPriceModifier: (req: Request, res: Response) => Promise<void>;
export declare const deletePriceModifier: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=property.controller.d.ts.map