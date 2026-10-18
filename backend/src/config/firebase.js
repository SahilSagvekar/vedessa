const admin = require('firebase-admin');

/**
 * Firebase Admin SDK (used only to verify Firebase ID tokens issued after a
 * Google or phone-OTP sign-in on the frontend).
 *
 * Credentials, either:
 *   A) FIREBASE_SERVICE_ACCOUNT_JSON  -> the whole service-account JSON file,
 *      pasted as one line (or base64-encoded)
 *   B) FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 *      (private key with literal "\n" sequences is fine)
 */
const loadServiceAccount = () => {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    const text = raw.trim().startsWith('{')
      ? raw
      : Buffer.from(raw, 'base64').toString('utf8');
    const json = JSON.parse(text);
    return {
      projectId: json.project_id,
      clientEmail: json.client_email,
      privateKey: json.private_key,
    };
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return {
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  return null;
};

let initialised = false;

/**
 * Lazily initialise and return firebase-admin. Throws a clear error if the
 * credentials are missing, so the server still boots (and staff login keeps
 * working) before Firebase has been configured.
 */
const getFirebaseAdmin = () => {
  if (!initialised) {
    if (admin.apps.length === 0) {
      const serviceAccount = loadServiceAccount();
      if (!serviceAccount) {
        throw new Error(
          'Firebase is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON (or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).'
        );
      }
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }
    initialised = true;
  }
  return admin;
};

module.exports = { getFirebaseAdmin };
