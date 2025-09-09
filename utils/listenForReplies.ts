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
    if (!userId) {
      console.log('⚠️ No authenticated user - skipping Firebase listeners to avoid permission errors');
      return;
    }

    console.log('🔥 Setting up Firebase listeners for user:', userId);

    // Listen for emergency alert replies
    const alertsQuery = query(
      collection(firestore, "emergencyAlerts"),
      where("userId", "==", userId)
    );

    const unsubscribeAlerts = onSnapshot(alertsQuery, (snapshot) => {
      snapshot.docChanges().forEach(async (change: DocumentChange) => {
        if (change.type === "modified") {
          const data = change.doc.data();
          console.log('🚨 Emergency alert updated:', data);
          
          if (data.replies && Array.isArray(data.replies)) {
            const latestReply = data.replies[data.replies.length - 1];
            if (latestReply && latestReply.id) {
              const notificationId = `alert-${change.doc.id}-${latestReply.id}`;
              
              if (!processedNotifications.has(notificationId)) {
                processedNotifications.add(notificationId);
                
                // Send enhanced push notification
                await sendEnhancedPushNotification(
                  'emergency-reply',
                  data.serviceType || 'emergency',
                  latestReply.message || 'Emergency response received',
                  latestReply.responderName,
                  latestReply.station,
                  {
                    alertId: change.doc.id,
                    replyId: latestReply.id,
                    serviceType: data.serviceType,
                  }
                );
                
                // Add to in-app notifications
                addNotification({
                  id: notificationId,
                  title: `${data.serviceType?.toUpperCase() || 'EMERGENCY'} Response Received`,
                  message: latestReply.message || 'Emergency response received',
                  timestamp: safeTimestamp(latestReply.timestamp),
                  type: "emergency-reply",
                  isRead: false,
                  serviceType: data.serviceType,
                  responderName: latestReply.responderName,
                  station: latestReply.station,
                });
              }
            }
          }
        }
      });
    }, (error) => {
      console.error('❌ Error listening to emergency alerts:', error);
    });

    // Listen for incident report replies
    const incidentsQuery = query(
      collection(firestore, "incidentReports"),
      where("userId", "==", userId)
    );

    const unsubscribeIncidents = onSnapshot(incidentsQuery, (snapshot) => {
      snapshot.docChanges().forEach(async (change: DocumentChange) => {
        if (change.type === "modified") {
          const data = change.doc.data();
          console.log('📋 Incident report updated:', data);
          
          if (data.replies && Array.isArray(data.replies)) {
            const latestReply = data.replies[data.replies.length - 1];
            if (latestReply && latestReply.id) {
              const notificationId = `incident-${change.doc.id}-${latestReply.id}`;
              
              if (!processedNotifications.has(notificationId)) {
                processedNotifications.add(notificationId);
                
                // Send enhanced push notification
                await sendEnhancedPushNotification(
                  'incident-reply',
                  'incident',
                  latestReply.message || 'Incident response received',
                  latestReply.responderName,
                  undefined,
                  {
                    incidentId: change.doc.id,
                    replyId: latestReply.id,
                  }
                );
                
                // Add to in-app notifications
                addNotification({
                  id: notificationId,
                  title: 'Incident Report Reply',
                  message: latestReply.message || 'Incident response received',
                  timestamp: safeTimestamp(latestReply.timestamp),
                  type: "incident-reply",
                  isRead: false,
                  responderName: latestReply.responderName,
                });
              }
            }
          }
        }
      });
    }, (error) => {
      console.error('❌ Error listening to incident reports:', error);
    });

    return () => {
      unsubscribeAlerts();
      unsubscribeIncidents();
    };
  }, []);
}
