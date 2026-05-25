import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback_please_change_me';
const JWT_EXPIRES_IN = '1d';
const VERIFY_EXPIRES_IN = '1h';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'USER' | 'TENANT';
  purpose?: 'verification' | 'reset' | 'access';
}

export const generateAccessToken = (payload: Omit<TokenPayload, 'purpose'>): string => {
  console.log("🔑 [DEBUG] generateAccessToken - Secret:", JWT_SECRET);
  return jwt.sign({ ...payload, purpose: 'access' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const generateVerificationToken = (payload: Omit<TokenPayload, 'purpose'>): string => {
  return jwt.sign({ ...payload, purpose: 'verification' }, JWT_SECRET, { expiresIn: VERIFY_EXPIRES_IN });
};

export const generateResetToken = (payload: Omit<TokenPayload, 'purpose'>): string => {
  return jwt.sign({ ...payload, purpose: 'reset' }, JWT_SECRET, { expiresIn: VERIFY_EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload => {
  console.log("🔑 [DEBUG] verifyToken - Secret:", JWT_SECRET);
  console.log("🔑 [DEBUG] verifyToken - Token:", token);
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
