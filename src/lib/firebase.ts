import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4XUJtugsbajIEkF3G6dHbDUE6t1Girdw",
  authDomain: "medinest-hospital.firebaseapp.com",
  projectId: "medinest-hospital",
  storageBucket: "medinest-hospital.firebasestorage.app",
  messagingSenderId: "485100057897",
  appId: "1:485100057897:web:84462f8f8740e136a67338"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
