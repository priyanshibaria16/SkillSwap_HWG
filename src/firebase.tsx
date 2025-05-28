// firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC4o_bA-tOsvj7Q9a9_f78_l8ZELdgVNMY",
  authDomain: "skillswap-984f1.firebaseapp.com",
  projectId: "skillswap-984f1",
  storageBucket: "skillswap-984f1.firebasestorage.app",
  messagingSenderId: "13307762670",
  appId: "1:13307762670:web:8859a72cbfb5c66e0ce0ff",
  measurementId: "G-MNZNG3ZJPF",
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
