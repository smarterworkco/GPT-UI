import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

export const auth = getAuth(app);
export const db = getFirestore(app);
