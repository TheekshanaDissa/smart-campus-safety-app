import { initializeApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const useMock = process.env.EXPO_PUBLIC_USE_MOCK_FIREBASE === 'true';
const hasValidFirebaseConfig =
  !useMock &&
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !String(firebaseConfig.apiKey).includes('YOUR_') &&
  !String(firebaseConfig.projectId).includes('YOUR_');

let app = null;
let auth = null;
let db = null;

if (hasValidFirebaseConfig) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    auth = getAuth(app);
  }
  db = getFirestore(app);
}

export { app, auth, db, hasValidFirebaseConfig };
