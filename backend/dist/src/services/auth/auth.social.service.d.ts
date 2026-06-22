export declare const socialLogin: (email: string, name: string, provider: string, providerId: string, action: "LOGIN" | "REGISTER", reqRole: "USER" | "TENANT") => Promise<{
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}>;
//# sourceMappingURL=auth.social.service.d.ts.map