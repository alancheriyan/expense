
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyALE4sPJ-Wp6r39sY_zEjkFLrITpYD874k",
  authDomain: "expense-dailytracker.firebaseapp.com",
  projectId: "expense-dailytracker",
  storageBucket: "expense-dailytracker.firebasestorage.app",
  messagingSenderId: "840591655633",
  appId: "1:840591655633:web:cc4301a615216139583bf0"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);