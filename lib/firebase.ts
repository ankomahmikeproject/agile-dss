import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAj54ATIPSolefud1JlZqRKVnvpOHimET0",
  authDomain: "agile-dss-42e51.firebaseapp.com",
  projectId: "agile-dss-42e51",
  storageBucket: "agile-dss-42e51.firebasestorage.app",
  messagingSenderId: "728757277592",
  appId: "1:728757277592:web:fb5a224c0b1798ac2611ed",
  measurementId: "G-427QLTMR9B"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;