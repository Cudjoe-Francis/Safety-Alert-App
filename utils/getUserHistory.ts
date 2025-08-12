import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebaseFirestore";

export async function getUserHistory() {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const alertsQuery = query(
    collection(firestore, "alerts"),
    where("userId", "==", userId)
  );
  const alertsSnapshot = await getDocs(alertsQuery);

  const history = [];
  for (const alertDoc of alertsSnapshot.docs) {
    const alertData = alertDoc.data();
    // Optionally, fetch replies here if needed
    history.push({ ...alertData, id: alertDoc.id });
  }
  return history;
}
