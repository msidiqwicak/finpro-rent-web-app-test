export declare const registerUser: (name: string, email: string, role: "USER" | "TENANT") => Promise<{
    message: string;
}>;
export declare const verifyAndSetPassword: (token: string, password: string) => Promise<{
    message: string;
}>;
export declare const login: (email: string, password: string, requestedRole: "USER" | "TENANT") => Promise<{
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}>;
export declare const requestPasswordReset: (email: string) => Promise<void>;
export declare const resendVerificationEmail: (email: string) => Promise<{
    message: string;
}>;
export declare const verifyEmailUpdate: (token: string) => Promise<{
    message: string;
}>;
export declare const confirmPasswordReset: (token: string, newPassword: string) => Promise<void>;
/**
 * Handles Social Login/Register with Strict Provider Isolation.
 *
 * Rules:
 *  - Only a user whose exact (provider + providerId) pair exists in user_providers may proceed.
 *  - If the email exists under a different method (LOCAL password or different OAuth provider),
 *    the request is rejected with a clear, descriptive error message.
 *  - No automatic account linking.
 */
export declare const socialLogin: (email: string, name: string, provider: string, providerId: string, action: "LOGIN" | "REGISTER", requestedRole: "USER" | "TENANT") => Promise<{
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map