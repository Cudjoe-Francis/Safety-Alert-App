import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebaseFirestore";
import { AlertData } from "./buildAlertData";

// Sends alert data to Firestore
export async function sendAlertToFirestore(alert: AlertData) {
  // alert.serviceType should be set to "police", "fire", etc.
  await addDoc(collection(firestore, "alerts"), alert);
}
