import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useNotification } from "../app/context/NotificationContext";
import { firestore } from "../firebaseFirestore";

function safeTimestamp(ts: any): Date {
  try {
    if (!ts) return new Date();
    if (typeof ts === "object" && typeof ts.toDate === "function") {
      return ts.toDate();
    }
    if (typeof ts === "object" && ts.seconds) {
      return new Date(ts.seconds * 1000);
    }
    if (typeof ts === "string" || typeof ts === "number") {
      const date = new Date(ts);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  } catch {
    return new Date();
  }
}

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
            const data = replyDoc.data();
            console.log("Alert reply data:", data); // Debugging log

            addNotification({
              id: replyDoc.id,
              message: data?.message || "No message",
              timestamp: safeTimestamp(data?.time),
              read: false,
              replyDetails: data,
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
              const data = replyDoc.data();
              console.log("Incident reply data:", data); // Debugging log

              addNotification({
                id: replyDoc.id,
                message: data?.message || "No message",
                timestamp: safeTimestamp(data?.time),
                read: false,
                replyDetails: data,
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
