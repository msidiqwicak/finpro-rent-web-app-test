import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
}, z.core.$strip>;
export declare const verifySchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const requestResetSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const confirmResetSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export declare const verifyEmailUpdateSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=auth.schema.d.ts.map