import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  type Auth,
  type ConfirmationResult,
} from 'firebase/auth';

/**
 * Firebase Auth wrapper. Firebase is only used to prove WHO the person is
 * (Google account or a verified phone number). After that we exchange the
 * Firebase ID token for our own JWT at POST /api/auth/firebase, and the rest
 * of the app keeps using that JWT as before.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | null = null;

const getFirebaseAuth = (): Auth => {
  if (!isFirebaseConfigured) {
    throw new Error('Sign-in is not available right now. Please try again later.');
  }
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  return getAuth(app);
};

/** Google popup -> Firebase ID token */
export const googleSignInIdToken = async (): Promise<string> => {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken();
};

let recaptcha: RecaptchaVerifier | null = null;
let confirmation: ConfirmationResult | null = null;

const resetRecaptcha = () => {
  try {
    recaptcha?.clear();
  } catch {
    /* already cleared */
  }
  recaptcha = null;
};

/** Send an SMS OTP to an E.164 number (e.g. +919876543210). */
export const sendPhoneOtp = async (phoneE164: string, recaptchaContainerId: string): Promise<void> => {
  const auth = getFirebaseAuth();
  resetRecaptcha();
  recaptcha = new RecaptchaVerifier(auth, recaptchaContainerId, { size: 'invisible' });
  try {
    confirmation = await signInWithPhoneNumber(auth, phoneE164, recaptcha);
  } catch (error) {
    resetRecaptcha();
    confirmation = null;
    throw error;
  }
};

/** Check the 6-digit code -> Firebase ID token */
export const confirmPhoneOtp = async (code: string): Promise<string> => {
  if (!confirmation) {
    throw new Error('Please request a new OTP.');
  }
  const result = await confirmation.confirm(code);
  return result.user.getIdToken();
};

export const clearPhoneOtp = () => {
  confirmation = null;
  resetRecaptcha();
};

/** Drop Firebase's own session; our JWT is what the app uses. */
export const firebaseLogout = async () => {
  clearPhoneOtp();
  if (!isFirebaseConfigured) return;
  try {
    await firebaseSignOut(getFirebaseAuth());
  } catch {
    /* ignore */
  }
};

/** Turn Firebase error codes into messages a customer can act on. */
export const friendlyAuthError = (error: unknown): string => {
  // Errors from our own API arrive as plain strings (see lib/api.js)
  if (typeof error === 'string') return error;
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google pop-up. Please allow pop-ups and try again.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid mobile number.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/invalid-verification-code':
      return 'That OTP is incorrect. Please check and try again.';
    case 'auth/code-expired':
      return 'That OTP has expired. Please request a new one.';
    case 'auth/quota-exceeded':
      return 'We could not send an OTP right now. Please try Google sign-in or try later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/unauthorized-domain':
      return 'This website is not authorised for sign-in yet.';
    default:
      return (error as Error)?.message || 'Something went wrong. Please try again.';
  }
};
