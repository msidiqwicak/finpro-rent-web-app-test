import admin from 'firebase-admin';

/**
 * Lazily initializes Firebase Admin SDK on first call.
 * This prevents the server from crashing on startup when
 * FIREBASE_SERVICE_ACCOUNT is not yet configured.
 */
const getAdminApp = () => {
  if (admin.apps.length > 0) return admin.apps[0]!;

  let rawEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!rawEnv || rawEnv.trim() === '') {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT is not set. Please add your Firebase service account JSON to Vercel environment variables.',
    );
  }

  // 1. Hapus outer single/double quotes yang mungkin ikut ter-copy dari .env
  rawEnv = rawEnv.trim().replace(/^['"`]|['"`]$/g, '').trim();

  // 2. Perbaiki escaped newline di private_key yang sering rusak saat copy-paste
  //    Vercel kadang tidak mempertahankan literal \n di dalam nilai env variable
  rawEnv = rawEnv.replace(/\\n/g, '\n');

  let serviceAccount: object;
  try {
    serviceAccount = JSON.parse(rawEnv);
  } catch (parseError: any) {
    console.error('[Firebase] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON.');
    console.error('[Firebase] First 100 chars of raw value:', rawEnv.substring(0, 100));
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT is not valid JSON. Parse error: ${parseError.message}. ` +
      'Make sure you paste the JSON content WITHOUT surrounding quotes in Vercel environment variables.',
    );
  }

  console.log('[Firebase] Admin SDK initializing...');
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
};

/**
 * Verifies a Firebase ID token sent from the frontend.
 * Returns decoded token payload (uid, email, name, picture).
 */
export const verifyFirebaseToken = async (idToken: string) => {
  try {
    const app     = getAdminApp();
    const decoded = await app.auth().verifyIdToken(idToken);

    return {
      uid:     decoded.uid,
      email:   decoded.email ?? '',
      name:    decoded.name  ?? decoded.email?.split('@')[0] ?? 'User',
      picture: decoded.picture,
    };
  } catch (err: any) {
    console.error('[Firebase] verifyFirebaseToken error:', err.message);
    throw err;
  }
};
