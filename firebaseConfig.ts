// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPSS-f63b7wb3-VEPvnBRe-0QnHU2HDPw",
  authDomain: "safety-alert-app-da762.firebaseapp.com",
  databaseURL: "https://safety-alert-app-da762-default-rtdb.firebaseio.com", // ✅ Add this line
  projectId: "safety-alert-app-da762",
  storageBucket: "safety-alert-app-da762.appspot.com", // fixed typo: `.app` → `.appspot.com`
  messagingSenderId: "219645090443",
  appId: "1:219645090443:web:fa2c9689e25731afd4d28e",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);





// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyAPSS-f63b7wb3-VEPvnBRe-0QnHU2HDPw",
//   authDomain: "safety-alert-app-da762.firebaseapp.com",
//   projectId: "safety-alert-app-da762",
//   storageBucket: "safety-alert-app-da762.appspot.com", // ✅ fixed here
//   messagingSenderId: "219645090443",
//   appId: "1:219645090443:web:fa2c9689e25731afd4d28e",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
