/**
 * firebase.ts — Firebase app initialization.
 *
 * All config values are read from Vite env vars (VITE_FIREBASE_*).
 * Copy .env.example → .env and fill in your Firebase project values.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// Persist the session in localStorage so the user stays logged in across
// page refreshes, app restarts, and device reboots.
setPersistence(auth, browserLocalPersistence).catch(() => {
  // Fails silently in restricted environments — local persistence is the
  // Firebase default anyway, so this is just an explicit guarantee.
});
