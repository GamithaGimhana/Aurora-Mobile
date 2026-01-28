// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// 1
// @ts-ignore - ignore firebase typescript issue for react native
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
// 2
import { getFirestore } from 'firebase/firestore';
// 3
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// web app's Firebase configuration
const firebaseConfig = {
  // apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  // authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,

  apiKey: "AIzaSyAbpyHGXbs0Pmx2psosV7XH_Reo0UebsQ0",
  authDomain: "aurora-mobile-app-45fdf.firebaseapp.com",
  projectId: "aurora-mobile-app-45fdf",
  storageBucket: "aurora-mobile-app-45fdf.firebasestorage.app",
  messagingSenderId: "92143689617",
  appId: "1:92143689617:web:c98b1994094ebb21854430",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Authentication 
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

// Firestore 
export const db = getFirestore(app)
