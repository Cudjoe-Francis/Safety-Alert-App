import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where, DocumentChange } from "firebase/firestore";
import { useEffect } from "react";
import { useNotification } from "../app/context/NotificationContext";
import { firestore } from "../firebaseFirestore";
import { 
  createEmergencyAlertNotification, 
  createIncidentReplyNotification, 
  sendEnhancedNotification,
  getDeviceTheme,
  getThemedNotificationColors
} from "./notificationConfig";

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

// Function to send enhanced push notification with fancy styling
async function sendEnhancedPushNotification(
  type: 'emergency-reply' | 'incident-reply',
  serviceType: string,
  message: string,
  responderName?: string,
  station?: string,
  additionalData?: any
) {
  try {
    const theme = getDeviceTheme();
    const colors = getThemedNotificationColors(theme);
    
    let notificationContent;
    
    if (type === 'emergency-reply') {
      notificationContent = createEmergencyAlertNotification(
        serviceType,
        message,
        responderName,
        station
      );
    } else {
      notificationContent = createIncidentReplyNotification(
        message,
        responderName
      );
    }
    
    // Merge additional data
    notificationContent.data = {
      ...notificationContent.data,
      ...additionalData,
    };
    
    // Apply theme-aware colors
    notificationContent.color = colors[serviceType.toLowerCase() as keyof typeof colors] || colors.emergency;
    
    await sendEnhancedNotification(notificationContent);
    
    console.log('🔔 Enhanced push notification sent:', {
      type,
      serviceType,
      message: message.substring(0, 50) + '...',
      theme,
    });
  } catch (error) {
    console.error('❌ Error sending enhanced push notification:', error);
  }
}

// Track processed notifications to prevent duplicates
const processedNotifications = new Set<string>();

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
              const notificationId = `alert-${alertDoc.id}-${change.doc.id}`;
              
              // Prevent duplicate notifications
              if (processedNotifications.has(notificationId)) {
                return;
              }
              processedNotifications.add(notificationId);
              
              const data = change.doc.data();
              console.log("Alert reply data:", data); // Debugging log

              // Get alert data to determine service type
              const alertData = alertDoc.data();
              
              // Send enhanced push notification for new reply
              sendEnhancedPushNotification(
                'emergency-reply',
                alertData?.serviceType || 'emergency',
                data?.message || "No message",
                data?.responderName,
                data?.station,
                { 
                  replyId: change.doc.id, 
                  type: "alert-reply",
                  alertId: alertDoc.id,
                  timestamp: new Date().toISOString()
                }
              );

              addNotification({
                id: notificationId,
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
                const notificationId = `incident-${incidentDoc.id}-${change.doc.id}`;
                
                // Prevent duplicate notifications
                if (processedNotifications.has(notificationId)) {
                  return;
                }
                processedNotifications.add(notificationId);
                
                const data = change.doc.data();
                console.log("Incident reply data:", data); // Debugging log

                // Send enhanced push notification for new incident reply
                sendEnhancedPushNotification(
                  'incident-reply',
                  'authority',
                  data?.message || "No message",
                  data?.responderName,
                  undefined,
                  { 
                    replyId: change.doc.id, 
                    type: "incident-reply",
                    incidentId: incidentDoc.id,
                    timestamp: new Date().toISOString()
                  }
                );

                addNotification({
                  id: notificationId,
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
