// client/src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxow1bZUzIrthTkveiQci3WFcGLJw_-40",
  authDomain: "businessaihub.firebaseapp.com",
  projectId: "businessaihub",
  storageBucket: "businessaihub.appspot.com",
  messagingSenderId: "10537277318",
  appId: "1:10537277318:web:618c7aa83ad3f2810c3e07",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// ✅ Ensures login persists even after refresh
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

export { auth };
export const db = getFirestore(app);
