// For security, use environment variables (.env file)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDtiMTMFrzO52ytchXWSvV9tLybDJZ30Hs",
  authDomain: "mobile-repair-shop-fd964.firebaseapp.com",
  projectId: "mobile-repair-shop-fd964",
  storageBucket: "mobile-repair-shop-fd964.firebasestorage.app",
  messagingSenderId: "1019375875499",
  appId: "1:1019375875499:web:6ae772dcdb1ad4ffd94eee",
  measurementId: "G-L6Z3ZS4R5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
