export declare const verifyAndSetPassword: (token: string, password: string) => Promise<{
    message: string;
}>;
export declare const requestPasswordReset: (email: string) => Promise<void>;
export declare const resendVerificationEmail: (email: string) => Promise<{
    message: string;
}>;
export declare const verifyEmailUpdate: (token: string) => Promise<{
    message: string;
}>;
export declare const confirmPasswordReset: (token: string, newPassword: string) => Promise<void>;
//# sourceMappingURL=auth.password.service.d.ts.map