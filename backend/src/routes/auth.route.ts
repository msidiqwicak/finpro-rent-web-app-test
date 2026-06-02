import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

// User Auth Routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Tenant Auth Routes
router.post('/register/tenant', authController.registerTenant);
router.post('/login/tenant', authController.loginTenant);

// General Auth Routes (Verification & Reset Password)
router.post('/verify',               authController.verifyEmail);
router.post('/verify-email-update',  authController.verifyEmailUpdate);
router.post('/resend-verification',  authController.resendVerification);
router.post('/reset-password',       authController.requestReset);
router.post('/confirm-reset',        authController.confirmReset);
router.post('/social-login',         authController.handleSocialLogin);


export default router;
