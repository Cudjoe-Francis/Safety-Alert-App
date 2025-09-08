import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBZqzDoNT5FILS1PHA98_DlZERgbN5Qrf0",
  authDomain: "safety-alert-app-3aa05.firebaseapp.com",
  databaseURL: "https://safety-alert-app-3aa05-default-rtdb.firebaseio.com",
  projectId: "safety-alert-app-3aa05",
  storageBucket: "safety-alert-app-3aa05.appspot.com",
  messagingSenderId: "619085971303",
  appId: "1:619085971303:web:9063a751b9deefb7cc39c2",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
