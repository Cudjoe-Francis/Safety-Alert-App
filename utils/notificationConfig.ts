import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior and appearance
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log('🔔 Notification received:', notification.request.content.title);
    console.log('🔔 Notification data:', notification.request.content.data);
    
    // Always show notifications - let the app handle filtering
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    };
  },
});

// Notification categories for different types of alerts
export const NotificationCategories = {
  EMERGENCY_ALERT: 'emergency-alert',
  EMERGENCY_REPLY: 'emergency-reply',
  INCIDENT_REPLY: 'incident-reply',
};

// Configure notification channels for Android
export async function setupNotificationChannels() {
  if (Platform.OS === 'android') {
    // Emergency Alert Channel - Highest priority
    await Notifications.setNotificationChannelAsync('emergency-alerts', {
      name: '🚨 Emergency Alerts',
      description: 'Critical emergency notifications that require immediate attention',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250, 250, 250],
      lightColor: '#ff5330',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      enableLights: true,
      enableVibrate: true,
      showBadge: true,
      sound: 'emergency-alert.wav',
    });

    // Emergency Reply Channel - High priority
    await Notifications.setNotificationChannelAsync('emergency-replies', {
      name: '💬 Emergency Replies',
      description: 'Responses from emergency services',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 150, 100, 150],
      lightColor: '#121a68',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      enableLights: true,
      enableVibrate: true,
      showBadge: true,
      sound: 'reply-notification.wav',
    });

    // Incident Reply Channel - Normal priority
    await Notifications.setNotificationChannelAsync('incident-replies', {
      name: '📋 Incident Replies',
      description: 'Responses to incident reports',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 100, 50, 100],
      lightColor: '#008080',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      enableLights: true,
      enableVibrate: true,
      showBadge: true,
      sound: 'default',
    });
  }
}

// Enhanced notification content with rich styling
export interface EnhancedNotificationContent {
  title: string;
  body: string;
  data?: any;
  categoryIdentifier?: string;
  sound?: string | boolean;
  badge?: number;
  priority?: Notifications.AndroidNotificationPriority;
  color?: string;
  sticky?: boolean;
  autoDismiss?: boolean;
  vibrate?: number[];
  channelId?: string;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  identifier: string;
  title: string;
  options?: {
    opensAppToForeground?: boolean;
    isAuthenticationRequired?: boolean;
    isDestructive?: boolean;
  };
}

// Create fancy emergency alert notification
export function createEmergencyAlertNotification(
  serviceType: string,
  message: string,
  responderName?: string,
  station?: string
): EnhancedNotificationContent {
  const serviceEmojis = {
    police: '👮‍♂️',
    hospital: '🏥',
    fire: '🚒',
    campus: '🏫',
  };

  const serviceColors = {
    police: '#1e40af',
    hospital: '#dc2626',
    fire: '#ea580c',
    campus: '#059669',
  };

  const emoji = serviceEmojis[serviceType.toLowerCase() as keyof typeof serviceEmojis] || '🚨';
  const color = serviceColors[serviceType.toLowerCase() as keyof typeof serviceColors] || '#ff5330';

  return {
    title: `${emoji} Emergency Reply Received`,
    body: responderName 
      ? `${serviceType.toUpperCase()} Response from ${responderName}${station ? ` (${station})` : ''}: ${message}`
      : `${serviceType.toUpperCase()} Response: ${message}`,
    sound: 'emergency-alert.wav',
    priority: Notifications.AndroidNotificationPriority.MAX,
    color: color,
    sticky: true,
    autoDismiss: false,
    vibrate: [0, 250, 250, 250, 250, 250],
    channelId: 'emergency-replies',
    badge: 1,
    // Remove categoryIdentifier to fix the nil error
    data: {
      type: 'emergency-reply',
      serviceType,
      responderName,
      station,
      timestamp: new Date().toISOString(),
      deepLink: 'safetyalertapp://notifications',
    },
  };
}

// Create incident reply notification
export function createIncidentReplyNotification(
  message: string,
  responderName?: string
): EnhancedNotificationContent {
  return {
    title: '📋 Incident Report Reply',
    body: responderName 
      ? `Authority Response from ${responderName}: ${message}`
      : `Authority Response: ${message}`,
    sound: 'reply-notification.wav',
    priority: Notifications.AndroidNotificationPriority.DEFAULT,
    color: '#008080',
    sticky: false,
    autoDismiss: true,
    vibrate: [0, 100, 50, 100],
    channelId: 'incident-replies',
    badge: 1,
    // Remove categoryIdentifier to fix the nil error
    data: {
      type: 'incident-reply',
      responderName,
      timestamp: new Date().toISOString(),
      deepLink: 'safetyalertapp://notifications',
    },
  };
}

// Send enhanced push notification
export async function sendEnhancedNotification(
  content: EnhancedNotificationContent
): Promise<string> {
  try {
    const notificationContent: any = {
      title: content.title,
      body: content.body,
      data: content.data || {},
      sound: content.sound || 'default',
      badge: content.badge,
      priority: content.priority || Notifications.AndroidNotificationPriority.HIGH,
    };

    // Only add categoryIdentifier if it's defined and not null
    if (content.categoryIdentifier) {
      notificationContent.categoryIdentifier = content.categoryIdentifier;
    }

    // Add Android-specific properties
    if (Platform.OS === 'android') {
      notificationContent.channelId = content.channelId || 'emergency-replies';
      notificationContent.color = content.color;
      notificationContent.sticky = content.sticky;
      notificationContent.autoDismiss = content.autoDismiss;
      notificationContent.vibrate = content.vibrate;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: null, // Send immediately
      identifier: `notification-${Date.now()}`,
    });

    console.log('🔔 Enhanced notification sent:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('❌ Error sending enhanced notification:', error);
    throw error;
  }
}

// Handle notification responses (when user taps actions)
export function setupNotificationResponseHandler() {
  Notifications.addNotificationResponseReceivedListener((response) => {
    const { actionIdentifier, notification } = response;
    const { data } = notification.request.content;

    console.log('📱 Notification action received:', actionIdentifier, data);

    switch (actionIdentifier) {
      case 'VIEW_REPLY':
        // Navigate to notifications screen or specific reply
        if (data?.deepLink) {
          // Handle deep link navigation
          console.log('🔗 Opening deep link:', data.deepLink);
        }
        break;
      
      case 'MARK_READ':
        // Mark notification as read without opening app
        console.log('✅ Marking notification as read');
        break;
      
      default:
        // Default tap behavior - open app
        if (data?.deepLink) {
          console.log('🔗 Opening app with deep link:', data.deepLink);
        }
        break;
    }
  });
}

// Request notification permissions with enhanced options
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: true,
          allowCriticalAlerts: true,
          provideAppNotificationSettings: true,
          allowProvisional: true,
          // allowAnnouncements: true, // Not available in current Expo version
        },
        android: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: true,
        },
      });
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      // Setup notification channels for Android
      await setupNotificationChannels();
      
      // Setup response handler
      setupNotificationResponseHandler();
      
      console.log('✅ Notification permissions granted and configured');
      return true;
    } else {
      console.log('❌ Notification permissions denied');
      return false;
    }
  } catch (error) {
    console.error('❌ Error requesting notification permissions:', error);
    return false;
  }
}

// Get device theme for dynamic styling
export function getDeviceTheme(): 'light' | 'dark' {
  // This would typically use a theme context or system settings
  // For now, we'll return a default that can be overridden
  return 'light';
}

// Apply theme-aware colors to notifications
export function getThemedNotificationColors(theme: 'light' | 'dark') {
  if (theme === 'dark') {
    return {
      emergency: '#ff6b6b',
      police: '#4dabf7',
      hospital: '#ff8cc8',
      fire: '#ffa94d',
      campus: '#51cf66',
      background: '#1a1a1a',
      text: '#ffffff',
    };
  } else {
    return {
      emergency: '#ff5330',
      police: '#1e40af',
      hospital: '#dc2626',
      fire: '#ea580c',
      campus: '#059669',
      background: '#ffffff',
      text: '#000000',
    };
  }
}
