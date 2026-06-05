import type { Request, Response, NextFunction } from "express";
import type { TokenPayload } from "../utils/jwt.js";
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
export declare const authorizeRole: (...roles: Array<"USER" | "TENANT">) => (req: Request, res: Response, next: NextFunction) => void;
export declare const verifyBookingOwnership: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map