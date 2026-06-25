export declare const registerUser: (name: string, email: string, role: "USER" | "TENANT") => Promise<{
    message: string;
}>;
export declare const login: (email: string, password: string, reqRole: "USER" | "TENANT") => Promise<{
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}>;
//# sourceMappingURL=auth.core.service.d.ts.map