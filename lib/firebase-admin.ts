import * as admin from 'firebase-admin';

const hasAdminCredentials =
    !!process.env.FIREBASE_PROJECT_ID &&
    !!process.env.FIREBASE_CLIENT_EMAIL &&
    !!process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
    admin.initializeApp(
        hasAdminCredentials
            ? {
                  credential: admin.credential.cert({
                      projectId: process.env.FIREBASE_PROJECT_ID,
                      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                      // Replace newline characters for Vercel/environment variable support
                      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                  }),
              }
            // No credentials yet — initialize without one so the app can boot.
            // Firestore/Auth calls will fail until real Firebase credentials are set in .env.local.
            : { projectId: 'bloom-unconfigured' }
    );
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
