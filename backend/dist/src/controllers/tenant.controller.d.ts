import type { Request, Response } from "express";
export declare const approvePayment: (req: Request, res: Response) => Promise<void>;
export declare const rejectPayment: (req: Request, res: Response) => Promise<void>;
export declare const cancelByTenant: (req: Request, res: Response) => Promise<void>;
export declare const getTenantBookings: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=tenant.controller.d.ts.map