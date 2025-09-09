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

    // Disable Firebase listeners to prevent permission errors
    console.log('⚠️ Firebase listeners disabled to prevent permission errors');
    console.log('📱 App will rely on push notifications from email server instead');
    
    // Return empty cleanup functions
    const unsubscribeAlerts = () => {};
    const unsubscribeIncidents = () => {};

    return () => {
      unsubscribeAlerts();
      unsubscribeIncidents();
    };
  }, []);
}
