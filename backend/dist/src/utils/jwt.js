import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback_please_change_me';
const JWT_EXPIRES_IN = '1d';
const VERIFY_EXPIRES_IN = '1h';
export const generateAccessToken = (payload) => {
    return jwt.sign({ ...payload, purpose: 'access' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
export const generateVerificationToken = (payload) => {
    return jwt.sign({ ...payload, purpose: 'verification' }, JWT_SECRET, { expiresIn: VERIFY_EXPIRES_IN });
};
/**
 * Generates a reset token whose secret is tied to the user's current password hash.
 * Once the password is changed, this token becomes automatically invalid.
 */
export const generateResetToken = (payload, currentPasswordHash) => {
    const secret = JWT_SECRET + currentPasswordHash;
    return jwt.sign({ ...payload, purpose: 'reset' }, secret, { expiresIn: VERIFY_EXPIRES_IN });
};
/**
 * Verifies a reset token using the user's current password hash as part of the secret.
 * If the password has already been changed, this will throw an "invalid signature" error.
 */
export const verifyResetToken = (token, currentPasswordHash) => {
    const secret = JWT_SECRET + currentPasswordHash;
    return jwt.verify(token, secret);
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
//# sourceMappingURL=jwt.js.map