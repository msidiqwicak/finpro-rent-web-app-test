/**
 * Verifies a Firebase ID token sent from the frontend.
 * Returns decoded token payload (uid, email, name, picture).
 */
export declare const verifyFirebaseToken: (idToken: string) => Promise<{
    uid: string;
    email: string;
    name: any;
    picture: string | undefined;
}>;
//# sourceMappingURL=firebase.d.ts.map