// Firebase configuration
// Replace these values with your Firebase project credentials

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA2qtFM0ppgnczsIGiCTNKcHDSxpKAbKN8",
    authDomain: "vjen-c6b73.firebaseapp.com",
    projectId: "vjen-c6b73",
    storageBucket: "vjen-c6b73.firebasestorage.app",
    messagingSenderId: "712874634708",
    appId: "1:712874634708:web:5cc5a3bb386851c6fbfa41",
    measurementId: "G-5TV7WJKF5G"
};

// DEBUG: Log to confirm hardcoded values are active
if (typeof window !== 'undefined') {
    console.log("Firebase Config: Using HARDCODED values for debugging.");
}

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
import { getStorage } from 'firebase/storage';
export const storage = getStorage(app);

export default app;
