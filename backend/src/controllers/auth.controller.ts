import type { Request, Response } from 'express';
import * as authService from '../services/auth/auth.service.js';
import * as authSchema from '../schemas/auth.schema.js';
import { verifyFirebaseToken } from '../utils/firebase.js';

const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = authSchema.registerSchema.parse(req.body);
    const result = await authService.registerUser(data.name, data.email, 'USER');
    res.status(201).json(result);
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

export const registerTenant = async (req: Request, res: Response) => {
  try {
    const data = authSchema.registerSchema.parse(req.body);
    const result = await authService.registerUser(data.name, data.email, 'TENANT');
    res.status(201).json(result);
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const data = authSchema.verifySchema.parse(req.body);
    const result = await authService.verifyAndSetPassword(data.token, data.password);
    res.status(200).json(result);
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const data = authSchema.loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.password, 'USER');
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(200).json({ user: result.user });
  } catch (error: any) { res.status(401).json({ error: error.message }); }
};

export const loginTenant = async (req: Request, res: Response) => {
  try {
    const data = authSchema.loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.password, 'TENANT');
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ user: result.user });
  } catch (error: any) { res.status(401).json({ error: error.message }); }
};

export const requestReset = async (req: Request, res: Response) => {
  try {
    const { email } = authSchema.requestResetSchema.parse(req.body);
    await authService.requestPasswordReset(email);
    res.status(200).json({ message: 'Jika email terdaftar, link reset akan dikirim.' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

export const confirmReset = async (req: Request, res: Response) => {
  try {
    const data = authSchema.confirmResetSchema.parse(req.body);
    await authService.confirmPasswordReset(data.token, data.newPassword);
    res.status(200).json({ message: 'Password berhasil direset.' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

/**
 * POST /api/auth/social-login
 * Receives a Firebase ID token, action (LOGIN | REGISTER), and requestedRole (USER | TENANT).
 * Verifies the token, then delegates to socialLogin service with strict role enforcement.
 */
export const handleSocialLogin = async (req: Request, res: Response) => {
  try {
    const { idToken, provider, action, requestedRole } = req.body as {
      idToken:       string;
      provider:      string;
      action:        'LOGIN' | 'REGISTER';
      requestedRole: 'USER' | 'TENANT';
    };

    if (!idToken || !provider || !action || !requestedRole) {
      res.status(400).json({ error: 'idToken, provider, action, and requestedRole are required.' });
      return;
    }

    console.log(`[SocialLogin] Received request: provider=${provider}, action=${action}, role=${requestedRole}`);

    const firebaseUser = await verifyFirebaseToken(idToken);
    console.log(`[SocialLogin] Firebase token verified for: ${firebaseUser.email}`);

    const result = await authService.socialLogin(
      firebaseUser.email,
      firebaseUser.name,
      provider.toUpperCase(),
      firebaseUser.uid,
      action,
      requestedRole,
    );

    console.log(`[SocialLogin] Success for user: ${result.user.email}, role: ${result.user.role}`);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ user: result.user });
  } catch (error: any) {
    // Bedakan error business logic (401) vs error server/Firebase (500)
    const isAuthError = error.message?.includes('registered') || error.message?.includes('login');
    const statusCode = isAuthError ? 401 : 500;
    console.error(`[SocialLogin] Error (${statusCode}):`, error.message);
    res.status(statusCode).json({ error: error.message ?? 'Social login failed.' });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    if (!email) {
      res.status(400).json({ error: 'Email wajib diisi.' });
      return;
    }
    const result = await authService.resendVerificationEmail(email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyEmailUpdate = async (req: Request, res: Response) => {
  try {
    const { token } = authSchema.verifyEmailUpdateSchema.parse(req.body);
    const result    = await authService.verifyEmailUpdate(token);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const { prisma } = await import('../utils/prisma.js');
    const dbUser = await prisma.users.findUnique({
      where: { id: req.user.id },
      include: { tenant: true }
    });
    
    if (!dbUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const role = dbUser.tenant ? 'TENANT' : 'USER';
    
    res.status(200).json({
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: role,
        avatar_url: dbUser.avatar_url
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
