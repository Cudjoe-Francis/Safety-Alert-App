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

// Track processed notifications to prevent duplicates - use Map to store with timestamp
const processedNotifications = new Map<string, number>();

// Clean up old processed notifications (older than 1 hour)
function cleanupProcessedNotifications() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [key, timestamp] of processedNotifications.entries()) {
    if (timestamp < oneHourAgo) {
      processedNotifications.delete(key);
    }
  }
}

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
    console.log('🔥 Listening to alerts collection for user-specific notifications only');

    // Listen for alert replies in the main alerts collection (where web dashboard stores them)
    const alertsQuery = query(
      collection(firestore, "alerts"),
      where("userId", "==", userId)
    );

    // Store reply listeners to clean them up properly
    const replyListeners = new Map<string, () => void>();

    const unsubscribeAlerts = onSnapshot(alertsQuery, (snapshot) => {
      snapshot.docChanges().forEach(async (change: DocumentChange) => {
        if (change.type === "added" || change.type === "modified") {
          const data = change.doc.data();
          console.log('🚨 Alert detected:', change.doc.id, 'Type:', change.type);
          console.log('🚨 Alert data:', JSON.stringify(data, null, 2));
          
          // Set up a listener for this specific alert's replies if not already listening
          if (!replyListeners.has(change.doc.id)) {
            const repliesQuery = query(collection(firestore, "alerts", change.doc.id, "replies"));
            
            const unsubscribeReplies = onSnapshot(repliesQuery, (repliesSnapshot) => {
              repliesSnapshot.docChanges().forEach(async (replyChange: DocumentChange) => {
                if (replyChange.type === "added") {
                  const replyData = replyChange.doc.data();
                  console.log('📝 NEW REPLY DETECTED - PROCESSING NOTIFICATION');
                  console.log('📝 Reply data:', JSON.stringify(replyData, null, 2));
                  console.log('📝 Alert data:', JSON.stringify(data, null, 2));
                  console.log('📝 Current user ID:', userId);
                  
                  const notificationId = `alert-${change.doc.id}-${replyChange.doc.id}`;
                  console.log('🔔 CREATING NOTIFICATION ID:', notificationId);
                  
                  // Clean up old processed notifications periodically
                  cleanupProcessedNotifications();
                  
                  if (!processedNotifications.has(notificationId)) {
                    processedNotifications.set(notificationId, Date.now());
                    console.log('✅ PROCESSING NEW REPLY - SENDING NOTIFICATIONS');
                    
                    try {
                      // Send enhanced push notification using the notification config
                      console.log('🔔 SENDING PUSH NOTIFICATION...');
                      
                      const notificationContent = createEmergencyAlertNotification(
                        data.serviceType || 'emergency',
                        replyData.message || 'Emergency response received',
                        replyData.responderName,
                        replyData.station
                      );
                      
                      // Add additional data
                      notificationContent.data = {
                        ...notificationContent.data,
                        alertId: change.doc.id,
                        replyId: replyChange.doc.id,
                        type: 'alert-reply',
                      };
                      
                      await sendEnhancedNotification(notificationContent);
                      console.log('✅ PUSH NOTIFICATION SENT');
                    } catch (error) {
                      console.error('❌ PUSH NOTIFICATION FAILED:', error);
                      console.error('❌ Error details:', JSON.stringify(error, null, 2));
                    }
                    
                    // Add to in-app notifications with proper reply details
                    console.log('📱 ADDING TO IN-APP NOTIFICATIONS...');
                    const notificationData = {
                      id: notificationId,
                      title: `${data.serviceType?.toUpperCase() || 'EMERGENCY'} Response Received`,
                      message: replyData.message || 'Emergency response received',
                      timestamp: safeTimestamp(replyData.time || replyData.createdAt),
                      type: "alert-reply" as const,
                      isRead: false,
                      serviceType: data.serviceType,
                      responderName: replyData.responderName,
                      station: replyData.station,
                      replyDetails: {
                        ...replyData,
                        alertId: change.doc.id,
                        createdAt: replyData.time || replyData.createdAt,
                      },
                    };
                    
                    console.log('📱 NOTIFICATION DATA:', JSON.stringify(notificationData, null, 2));
                    addNotification(notificationData);
                    console.log('✅ IN-APP NOTIFICATION ADDED');
                    
                    console.log('✅ ALL NOTIFICATIONS PROCESSED SUCCESSFULLY');
                  } else {
                    console.log('⚠️ Notification already processed:', notificationId);
                  }
                }
              });
            }, (error) => {
              console.error('❌ Error listening to replies subcollection:', error);
            });
            
            // Store the unsubscribe function
            replyListeners.set(change.doc.id, unsubscribeReplies);
          }
        }
      });
    }, (error) => {
      console.error('❌ Error listening to alerts:', error);
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
                processedNotifications.set(notificationId, Date.now());
                
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
      
      // Clean up all reply listeners
      replyListeners.forEach((unsubscribe) => {
        unsubscribe();
      });
      replyListeners.clear();
    };
  }, []);
}
