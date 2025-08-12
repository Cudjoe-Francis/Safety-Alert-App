import { addDoc, collection, Timestamp } from "firebase/firestore";
import { firestore } from "../firebaseFirestore";

export async function sendIncidentReport(report: any) {
  const incidentRef = collection(firestore, "incidentReports");
  await addDoc(incidentRef, {
    ...report,
    time: Timestamp.now(),
  });
}
