import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPSS-f63b7wb3-VEPvnBRe-0QnHU2HDPw",
  authDomain: "safety-alert-app-da762.firebaseapp.com",
  projectId: "safety-alert-app-da762",
  storageBucket: "safety-alert-app-da762.appspot.com",
  messagingSenderId: "219645090443",
  appId: "1:219645090443:web:fa2c9689e25731afd4d28e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
