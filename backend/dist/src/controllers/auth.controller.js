import * as authService from '../services/auth.service.js';
import * as authSchema from '../schemas/auth.schema.js';
import { verifyFirebaseToken } from '../utils/firebase.js';
export const registerUser = async (req, res) => {
    try {
        const data = authSchema.registerSchema.parse(req.body);
        const result = await authService.registerUser(data.name, data.email, 'USER');
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const registerTenant = async (req, res) => {
    try {
        const data = authSchema.registerSchema.parse(req.body);
        const result = await authService.registerUser(data.name, data.email, 'TENANT');
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const verifyEmail = async (req, res) => {
    try {
        const data = authSchema.verifySchema.parse(req.body);
        const result = await authService.verifyAndSetPassword(data.token, data.password);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const loginUser = async (req, res) => {
    try {
        const data = authSchema.loginSchema.parse(req.body);
        const result = await authService.login(data.email, data.password, 'USER');
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};
export const loginTenant = async (req, res) => {
    try {
        const data = authSchema.loginSchema.parse(req.body);
        const result = await authService.login(data.email, data.password, 'TENANT');
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};
export const requestReset = async (req, res) => {
    try {
        const { email } = authSchema.requestResetSchema.parse(req.body);
        await authService.requestPasswordReset(email);
        res.status(200).json({ message: 'Jika email terdaftar, link reset akan dikirim.' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const confirmReset = async (req, res) => {
    try {
        const data = authSchema.confirmResetSchema.parse(req.body);
        await authService.confirmPasswordReset(data.token, data.newPassword);
        res.status(200).json({ message: 'Password berhasil direset.' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
/**
 * POST /api/auth/social-login
 * Receives a Firebase ID token, action (LOGIN | REGISTER), and requestedRole (USER | TENANT).
 * Verifies the token, then delegates to socialLogin service with strict role enforcement.
 */
export const handleSocialLogin = async (req, res) => {
    try {
        const { idToken, provider, action, requestedRole } = req.body;
        if (!idToken || !provider || !action || !requestedRole) {
            res.status(400).json({ error: 'idToken, provider, action, and requestedRole are required.' });
            return;
        }
        const firebaseUser = await verifyFirebaseToken(idToken);
        const result = await authService.socialLogin(firebaseUser.email, firebaseUser.name, provider.toUpperCase(), firebaseUser.uid, action, requestedRole);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({ error: error.message ?? 'Social login failed.' });
    }
};
export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email wajib diisi.' });
            return;
        }
        const result = await authService.resendVerificationEmail(email);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const verifyEmailUpdate = async (req, res) => {
    try {
        const { token } = authSchema.verifyEmailUpdateSchema.parse(req.body);
        const result = await authService.verifyEmailUpdate(token);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//# sourceMappingURL=auth.controller.js.map