import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXZAlET8CIp0W7yR4CMZ2ULNeNZuNPTL4",
  authDomain: "dti-project-7d7f4.firebaseapp.com",
  projectId: "dti-project-7d7f4",
  storageBucket: "dti-project-7d7f4.firebasestorage.app",
  messagingSenderId: "574331881661",
  appId: "1:574331881661:web:ce89dc48a2ddde5ea68fd4",
  measurementId: "G-NEWJYZZDXG"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics if in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, storage, analytics };