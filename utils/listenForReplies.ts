import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where, DocumentChange } from "firebase/firestore";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
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

// Function to send push notification with enhanced features
async function sendPushNotification(title: string, body: string, data?: any) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
        badge: 1,
      },
      trigger: null, // Send immediately
    });
    
    // Log notification for debugging
    console.log('🔔 Push notification sent:', { title, body, data });
  } catch (error) {
    console.error('❌ Error sending push notification:', error);
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
          repliesSnapshot.docChanges().forEach((change: DocumentChange<any>) => {
            if (change.type === "added") {
              const data = change.doc.data();
              console.log("Alert reply data:", data); // Debugging log

              // Send enhanced push notification for new reply
              sendPushNotification(
                "🚨 Emergency Reply Received",
                `Emergency Service Reply: ${data?.message || "No message"}`,
                { 
                  replyId: change.doc.id, 
                  type: "alert-reply",
                  alertId: alertDoc.id,
                  timestamp: new Date().toISOString()
                }
              );

              addNotification({
                id: change.doc.id,
                message: data?.message || "No message",
                timestamp: safeTimestamp(data?.time),
                read: false,
                replyDetails: data,
                type: "alert-reply",
              });
            }
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
            repliesSnapshot.docChanges().forEach((change: DocumentChange<any>) => {
              if (change.type === "added") {
                const data = change.doc.data();
                console.log("Incident reply data:", data); // Debugging log

                // Send enhanced push notification for new incident reply
                sendPushNotification(
                  "📋 Incident Report Reply",
                  `Authority Response: ${data?.message || "No message"}`,
                  { 
                    replyId: change.doc.id, 
                    type: "incident-reply",
                    incidentId: incidentDoc.id,
                    timestamp: new Date().toISOString()
                  }
                );

                addNotification({
                  id: change.doc.id,
                  message: data?.message || "No message",
                  timestamp: safeTimestamp(data?.time),
                  read: false,
                  replyDetails: data,
                  type: "incident-reply",
                });
              }
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
