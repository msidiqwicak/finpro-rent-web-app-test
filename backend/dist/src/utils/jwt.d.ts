export interface TokenPayload {
    id: string;
    email: string;
    role: 'USER' | 'TENANT';
    purpose?: 'verification' | 'reset' | 'access';
}
export declare const generateAccessToken: (payload: Omit<TokenPayload, "purpose">) => string;
export declare const generateVerificationToken: (payload: Omit<TokenPayload, "purpose">) => string;
/**
 * Generates a reset token whose secret is tied to the user's current password hash.
 * Once the password is changed, this token becomes automatically invalid.
 */
export declare const generateResetToken: (payload: Omit<TokenPayload, "purpose">, currentPasswordHash: string) => string;
/**
 * Verifies a reset token using the user's current password hash as part of the secret.
 * If the password has already been changed, this will throw an "invalid signature" error.
 */
export declare const verifyResetToken: (token: string, currentPasswordHash: string) => TokenPayload;
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=jwt.d.ts.map