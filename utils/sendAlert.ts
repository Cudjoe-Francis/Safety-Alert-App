import { addDoc, collection, Timestamp } from "firebase/firestore";
import { firestore } from "../firebaseFirestore";
import { AlertData } from "./buildAlertData";

// Sends alert data to Firestore
export async function sendAlertToFirestore(alert: AlertData) {
  const alertsRef = collection(firestore, "alerts");
  await addDoc(alertsRef, {
    ...alert,
    time: Timestamp.fromDate(alert.time), // Firestore Timestamp
  });
}
