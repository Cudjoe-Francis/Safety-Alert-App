import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useNotification } from "../app/context/NotificationContext";
import { firestore } from "../firebaseFirestore";

export function useListenForReplies() {
  const { addNotification } = useNotification();

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Listen for alert replies
    const alertsQuery = query(
      collection(firestore, "alerts"),
      where("userId", "==", userId)
    );
    const unsubscribeAlerts = onSnapshot(alertsQuery, (alertsSnapshot) => {
      alertsSnapshot.forEach((alertDoc) => {
        const repliesRef = collection(
          firestore,
          "alerts",
          alertDoc.id,
          "replies"
        );
        onSnapshot(repliesRef, (repliesSnapshot) => {
          repliesSnapshot.forEach((replyDoc) => {
            addNotification({
              id: replyDoc.id,
              message: replyDoc.data().message,
              timestamp: replyDoc.data().time.toDate(),
              read: false,
              replyDetails: replyDoc.data(),
              type: "alert-reply",
            });
          });
        });
      });
    });

    // Listen for incident report replies
    const incidentQuery = query(
      collection(firestore, "incidentReports"),
      where("userId", "==", userId)
    );
    const unsubscribeIncidents = onSnapshot(
      incidentQuery,
      (incidentSnapshot) => {
        incidentSnapshot.forEach((incidentDoc) => {
          const repliesRef = collection(
            firestore,
            "incidentReports",
            incidentDoc.id,
            "replies"
          );
          onSnapshot(repliesRef, (repliesSnapshot) => {
            repliesSnapshot.forEach((replyDoc) => {
              addNotification({
                id: replyDoc.id,
                message: replyDoc.data().message,
                timestamp: replyDoc.data().time.toDate(),
                read: false,
                replyDetails: replyDoc.data(),
                type: "incident-reply",
              });
            });
          });
        });
      }
    );

    return () => {
      unsubscribeAlerts();
      unsubscribeIncidents();
    };
  }, []);
}
