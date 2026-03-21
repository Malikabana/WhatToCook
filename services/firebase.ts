import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMfPN2j4kRkFf1-IWXTcjxVF1FHbx21YE",
  authDomain: "smartmeal-5bc65.firebaseapp.com",
  projectId: "smartmeal-5bc65",
  storageBucket: "smartmeal-5bc65.firebasestorage.app",
  messagingSenderId: "568879257216",
  appId: "1:568879257216:web:891dfb85b402233c28b865",
};

// Only initialize if not already done
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});