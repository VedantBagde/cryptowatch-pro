// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Hardcoded configuration (तुरंत काम करने के लिए)
const firebaseConfig = {
  apiKey: "AIzaSyChkvQdPzPP5S4xoSj4hECXH491q7E2D8E",
  authDomain: "vedx-cryptowatch-pro.firebaseapp.com",
  projectId: "vedx-cryptowatch-pro",
  storageBucket: "vedx-cryptowatch-pro.firebasestorage.app",
  messagingSenderId: "820787901517",
  appId: "1:820787901517:web:17f8fa24b56a19b080d804"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth और db services
export const auth = getAuth(app);
export const db = getFirestore(app);