export declare const getUserProfile: (userId: string) => Promise<{
    providers: string[];
    id: string;
    email: string;
    name: string;
    created_at: Date;
    is_verified: boolean | null;
    phone: string | null;
    avatar_url: string | null;
}>;
type UpdateProfileInput = {
    name?: string;
    phone?: string;
    email?: string;
};
export declare const updateUserProfile: (userId: string, data: UpdateProfileInput) => Promise<{
    id: string;
    email: string;
    name: string;
    created_at: Date;
    password_hash: string | null;
    is_verified: boolean | null;
    phone: string | null;
    avatar_url: string | null;
    user_providers: {
        provider: string;
    }[];
}>;
export declare const changeUserPassword: (userId: string, oldPassword: string, newPassword: string) => Promise<{
    message: string;
}>;
export {};
//# sourceMappingURL=user.service.d.ts.map