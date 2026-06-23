import type { Request, Response } from 'express';
export declare const registerUser: (req: Request, res: Response) => Promise<void>;
export declare const registerTenant: (req: Request, res: Response) => Promise<void>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<void>;
export declare const loginUser: (req: Request, res: Response) => Promise<void>;
export declare const loginTenant: (req: Request, res: Response) => Promise<void>;
export declare const requestReset: (req: Request, res: Response) => Promise<void>;
export declare const confirmReset: (req: Request, res: Response) => Promise<void>;
/**
 * POST /api/auth/social-login
 * Receives a Firebase ID token, action (LOGIN | REGISTER), and requestedRole (USER | TENANT).
 * Verifies the token, then delegates to socialLogin service with strict role enforcement.
 */
export declare const handleSocialLogin: (req: Request, res: Response) => Promise<void>;
export declare const resendVerification: (req: Request, res: Response) => Promise<void>;
export declare const verifyEmailUpdate: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map