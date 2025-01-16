// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALE4sPJ-Wp6r39sY_zEjkFLrITpYD874k",
  authDomain: "expense-dailytracker.firebaseapp.com",
  projectId: "expense-dailytracker",
  storageBucket: "expense-dailytracker.firebasestorage.app",
  messagingSenderId: "840591655633",
  appId: "1:840591655633:web:cc4301a615216139583bf0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db= getFirestore(app);

export {db};