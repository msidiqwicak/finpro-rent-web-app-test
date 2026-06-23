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
      'FIREBASE_SERVICE_ACCOUNT is not set in .env. ' +
      'Please add your Firebase service account JSON to enable social login.',
    );
  }

  // Strip wrapping single/double quotes that dotenv may preserve
  rawEnv = rawEnv.replace(/^['"]|['"]$/g, '');

  const serviceAccount = JSON.parse(rawEnv);

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

/**
 * Verifies a Firebase ID token sent from the frontend.
 * Returns decoded token payload (uid, email, name, picture).
 */
export const verifyFirebaseToken = async (idToken: string) => {
  const app     = getAdminApp();
  const decoded = await app.auth().verifyIdToken(idToken);

  return {
    uid:     decoded.uid,
    email:   decoded.email ?? '',
    name:    decoded.name  ?? decoded.email?.split('@')[0] ?? 'User',
    picture: decoded.picture,
  };
};
