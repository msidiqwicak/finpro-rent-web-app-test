import type { Request, Response } from "express";
export declare const approvePayment: (req: Request, res: Response) => Promise<void>;
export declare const rejectPayment: (req: Request, res: Response) => Promise<void>;
export declare const cancelByTenant: (req: Request, res: Response) => Promise<void>;
export declare const getTenantBookings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTenantBookingDetail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const sendReminderEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDashboardStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=tenant.controller.d.ts.map