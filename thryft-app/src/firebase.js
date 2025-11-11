import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYDsWSk-okMQ-cFcth-edV-lFABKtzLzo",
  authDomain: "thryft-app-b2270.firebaseapp.com",
  projectId: "thryft-app-b2270",
  storageBucket: "thryft-app-b2270.appspot.com",
  messagingSenderId: "798439046806",
  appId: "1:798439046806:web:1b519b1b0d9c68235e0cb7",
  measurementId: "G-ENXJQ96CHT"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

