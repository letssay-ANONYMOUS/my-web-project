import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const runtime = globalThis;
const rawConfig = runtime.__firebase_config;
const firebaseConfig = rawConfig ? JSON.parse(rawConfig) : {};
const hasFirebaseConfig = Boolean(
  firebaseConfig && Object.keys(firebaseConfig).length > 0
);

let auth = null;
let db = null;
let isFirebaseEnabled = false;

if (hasFirebaseConfig) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isFirebaseEnabled = true;
  } catch (error) {
    console.warn('Firebase disabled: invalid runtime config.', error);
  }
}

export { auth, db, isFirebaseEnabled };
export const appId = runtime.__app_id || 'default-app-id';
