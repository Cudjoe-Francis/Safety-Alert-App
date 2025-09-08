import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebaseFirestore";
import { AlertData } from "./buildAlertData";

// Sends alert data to Firestore
export async function sendAlertToFirestore(alert: AlertData) {
  // alert.serviceType should be set to "police", "fire", etc.
  // Ensure user email is included in the alert data
  const alertWithEmail = {
    ...alert,
    userEmail: alert.user.email, // Add userEmail field for easy access
  };
  
  await addDoc(collection(firestore, "alerts"), alertWithEmail);
}
