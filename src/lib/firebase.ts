import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "anistream-z88tx",
  appId: "1:645190001140:web:e8cb548fc8ab2b122319a1",
  storageBucket: "anistream-z88tx.firebasestorage.app",
  apiKey: "AIzaSyAwTQg4ZoJb5aDLCAoZRLQeu1yKt160YxA",
  authDomain: "anistream-z88tx.firebaseapp.com",
  messagingSenderId: "645190001140",
  measurementId: "G-65YPS7T5G5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
