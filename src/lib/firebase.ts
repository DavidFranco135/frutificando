import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

// Config hardcoded — these are public client-side keys (safe to commit)
const firebaseConfig = {
  apiKey: "AIzaSyA0NNXzbi6NpctcPudTUswms6HkqBV_uQo",
  authDomain: "niklaus-9c2b6.firebaseapp.com",
  projectId: "niklaus-9c2b6",
  storageBucket: "niklaus-9c2b6.firebasestorage.app",
  messagingSenderId: "608119762863",
  appId: "1:608119762863:web:8d022ec10741e9d0b8895a",
  measurementId: "G-CH1ZFCXDDF",
};

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

function getApp_(): FirebaseApp {
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
}

export function getDb(): Firestore {
  if (typeof window === 'undefined') throw new Error('Firestore must be used client-side only');
  if (!_db) _db = getFirestore(getApp_());
  return _db;
}

export function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') throw new Error('Auth must be used client-side only');
  if (!_auth) _auth = getAuth(getApp_());
  return _auth;
}
