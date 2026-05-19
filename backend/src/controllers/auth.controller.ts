import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import * as authSchema from '../schemas/auth.schema.js';

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
    res.status(200).json(result);
  } catch (error: any) { res.status(401).json({ error: error.message }); }
};

export const loginTenant = async (req: Request, res: Response) => {
  try {
    const data = authSchema.loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.password, 'TENANT');
    res.status(200).json(result);
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
