import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

export { storage, ref };
