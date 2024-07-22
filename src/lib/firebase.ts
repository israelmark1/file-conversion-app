// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  storageBucket: "gs://fileconversion-27a06.appspot.com",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

export { storage, ref };
