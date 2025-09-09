import { firestore } from "@/firebaseConfig";
import { useTheme } from "@/themeContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  RectButton,
  Swipeable,
} from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { useListenForReplies } from "../../utils/listenForReplies";
import { useNotification } from "../context/NotificationContext";

export type NotificationItem = {
  id: string;
  title?: string;
  message: string;
  timestamp: string;
  replyDetails?: any;
  type?: "alert-reply" | "incident-reply" | "emergency-reply";
  read?: boolean;
  serviceType?: string;
  responderName?: string;
  station?: string;
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { notifications: appNotifications, markNotificationAsRead } = useNotification(); // <-- Get in-app notifications and mark as read function

  const { isDarkMode } = useTheme();

  const navigation = useNavigation();
  const router = useRouter();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode
          ? offsetY > 23
            ? "#121212"
            : "#000"
          : "#fff",
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
        },
      });
    }, [isDarkMode, navigation])
  );

  useEffect(() => {
    animateIn();

    // Listener for received push notifications
    const subscriptionReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📱 Push notification received in notifications screen:', notification.request.content.title);
        console.log('📱 Notification data:', notification.request.content.data);
        
        const data = notification.request.content.data;
        
        // Process all notifications but log for debugging
        const newNotification: NotificationItem = {
          id: notification.request.identifier + "-" + uuid.v4(),
          title: notification.request.content.title || "Security Alert",
          message: notification.request.content.body || "Message from responder.",
          timestamp: new Date().toLocaleString(),
          replyDetails: data?.reply,
          type: data?.type as "alert-reply" | "incident-reply" | "emergency-reply",
          serviceType: data?.serviceType as string,
          responderName: data?.responderName as string,
          station: data?.station as string,
          read: false,
        };

        console.log('📱 Adding notification to list:', newNotification);
        setNotifications((prev) => [newNotification, ...prev]);
      }
    );

    return () => {
      subscriptionReceived.remove();
    };
  }, []);

  // Load push notifications from AsyncStorage on component mount
  useEffect(() => {
    AsyncStorage.getItem("notifications").then((data) => {
      if (data) {
        const parsed = JSON.parse(data);
        console.log('📱 Loaded push notifications from storage:', parsed.length);
        setNotifications(parsed);
      }
    });
  }, []);

  // Save push notifications to AsyncStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      saveNotificationsToStorage(notifications);
    }
  }, [notifications]);

  useListenForReplies();

  // Debug logging for notifications
  console.log('🔍 App notifications from context:', appNotifications.length);
  console.log('🔍 App notifications details:', appNotifications.slice(0, 3)); // Limit logging
  console.log('🔍 Push notifications:', notifications.length);
  console.log('🔍 Push notifications details:', notifications.slice(0, 3)); // Limit logging
  
  // Combine push notifications and app notifications with proper deduplication
  const allNotifications = [
    ...appNotifications.map((n) => ({
      id: n.id.toString(),
      title: n.title || "Emergency Reply Received",
      message:
        typeof n.message === "string" ? n.message : JSON.stringify(n.message),
      timestamp:
        typeof n.timestamp === "string"
          ? n.timestamp
          : n.timestamp instanceof Date 
            ? n.timestamp.toLocaleString() 
            : new Date().toLocaleString(),
      replyDetails: n.replyDetails || undefined,
      type: n.type || "alert-reply",
      read: n.read || n.isRead || false,
      serviceType: n.serviceType,
      responderName: n.responderName,
      station: n.station,
    })),
    ...notifications,
  ];
  
  console.log('🔍 Total combined notifications:', allNotifications.length);
  console.log('🔍 All notifications details:', allNotifications.slice(0, 5)); // Limit logging to first 5

  // Enhanced deduplication using both id and message content
  const uniqueNotifications = Array.from(
    new Map(
      allNotifications.map((n) => [
        `${n.id}-${n.message?.substring(0, 50)}`, // Use id + message snippet as key
        n
      ])
    ).values()
  );

  const animateIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  const handleNotificationPress = (item: NotificationItem) => {
    // Mark as read in push notifications
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === item.id ? { ...n, read: true } : n
      );
      saveNotificationsToStorage(updated);
      return updated;
    });
    
    // Mark as read in app notifications context if it exists there
    const appNotification = appNotifications.find(n => n.id === item.id);
    if (appNotification) {
      markNotificationAsRead(item.id);
    }
    
    if (item.replyDetails) {
      router.push({
        pathname: "/(menu-components)/ReplyDetails",
        params: {
          reply: JSON.stringify(item.replyDetails),
          time: item.timestamp, // Pass the time received
        },
      });
    } else {
      console.log("No reply details available.");
    }
  };

  const handleDeleteNotification = async (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveNotificationsToStorage(updated);
      return updated;
    });

    try {
      const notification = notifications.find((n) => n.id === id);
      if (
        notification &&
        notification.replyDetails &&
        notification.replyDetails.alertId
      ) {
        const alertId = notification.replyDetails.alertId;
        const replyId = id;
        await deleteDoc(doc(firestore, "alerts", alertId, "replies", replyId));
      }
    } catch (error) {
      console.error("Failed to delete reply from Firestore:", error);
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    // Determine service type and icon based on reply details
    const getServiceIcon = () => {
      if (item.type === "incident-reply") return "document-text";
      // Check for service type in multiple places
      const serviceType = item.serviceType || 
        item.replyDetails?.serviceType || 
        (item.responderName?.toLowerCase().includes('police') ? 'police' : 
         item.responderName?.toLowerCase().includes('hospital') ? 'hospital' : 
         item.responderName?.toLowerCase().includes('fire') ? 'fire' : 
         item.replyDetails?.responderName?.toLowerCase().includes('police') ? 'police' : 
         item.replyDetails?.responderName?.toLowerCase().includes('hospital') ? 'hospital' : 
         item.replyDetails?.responderName?.toLowerCase().includes('fire') ? 'fire' : 'emergency');
      
      if (serviceType?.toLowerCase() === "police") return "shield";
      if (serviceType?.toLowerCase() === "hospital") return "medical";
      if (serviceType?.toLowerCase() === "fire") return "flame";
      return "chatbubble-ellipses";
    };

    const getServiceColor = () => {
      if (item.type === "incident-reply") return "#008080";
      const serviceType = item.serviceType || 
        item.replyDetails?.serviceType || 
        (item.responderName?.toLowerCase().includes('police') ? 'police' : 
         item.responderName?.toLowerCase().includes('hospital') ? 'hospital' : 
         item.responderName?.toLowerCase().includes('fire') ? 'fire' : 
         item.replyDetails?.responderName?.toLowerCase().includes('police') ? 'police' : 
         item.replyDetails?.responderName?.toLowerCase().includes('hospital') ? 'hospital' : 
         item.replyDetails?.responderName?.toLowerCase().includes('fire') ? 'fire' : 'emergency');
      
      if (serviceType?.toLowerCase() === "police") return "#1e40af";
      if (serviceType?.toLowerCase() === "hospital") return "#16a34a";
      if (serviceType?.toLowerCase() === "fire") return "#dc2626";
      return "#ff5330";
    };

    const getServiceName = () => {
      const serviceType = item.serviceType || 
        item.replyDetails?.serviceType || 
        (item.responderName?.toLowerCase().includes('police') ? 'police' : 
         item.responderName?.toLowerCase().includes('hospital') ? 'hospital' : 
         item.responderName?.toLowerCase().includes('fire') ? 'fire' : 
         item.replyDetails?.responderName?.toLowerCase().includes('police') ? 'police' : 
         item.replyDetails?.responderName?.toLowerCase().includes('hospital') ? 'hospital' : 
         item.replyDetails?.responderName?.toLowerCase().includes('fire') ? 'fire' : 'emergency');
      
      if (serviceType?.toLowerCase() === "police") return "Police";
      if (serviceType?.toLowerCase() === "hospital") return "Hospital";
      if (serviceType?.toLowerCase() === "fire") return "Fire Department";
      return "Emergency Service";
    };

    // Format timestamp from Firestore timestamp or string
    const formatReplyTimestamp = (timestamp: any) => {
      if (!timestamp) return "Unknown time";
      
      try {
        // Handle Firestore timestamp
        if (timestamp && typeof timestamp === 'object' && timestamp.toDate) {
          return timestamp.toDate().toLocaleString();
        }
        // Handle timestamp with seconds
        if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
          return new Date(timestamp.seconds * 1000).toLocaleString();
        }
        // Handle string or number
        if (typeof timestamp === 'string' || typeof timestamp === 'number') {
          const date = new Date(timestamp);
          return isNaN(date.getTime()) ? String(timestamp) : date.toLocaleString();
        }
        return String(timestamp);
      } catch (error) {
        console.error('Error formatting timestamp:', error);
        return "Unknown time";
      }
    };

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <TouchableOpacity
          onPress={() => handleNotificationPress(item)}
          style={[
            styles.notificationCard,
            { borderLeftColor: getServiceColor() }
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.serviceIconContainer, { backgroundColor: getServiceColor() }]}>
              <Ionicons
                name={getServiceIcon()}
                size={24}
                color="#fff"
              />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{getServiceName()}</Text>
              <Text style={styles.responderInfo}>
                {(item.responderName || item.replyDetails?.responderName) ? 
                  `${item.responderName || item.replyDetails?.responderName}` : 'Emergency Response'}
                {(item.station || item.replyDetails?.station) ? 
                  ` - ${item.station || item.replyDetails?.station}` : ''}
              </Text>
              {item.replyDetails?.alertId && (
                <Text style={styles.alertIdText}>
                  Alert ID: {item.replyDetails.alertId.substring(0, 8)}...
                </Text>
              )}
            </View>
            {!item.read && <View style={styles.unreadIndicator} />}
          </View>
          
          <Text style={styles.replyMessage}>
            {typeof item.message === "string" ? item.message : JSON.stringify(item.message)}
          </Text>
          
          <Text style={styles.replyTimestamp}>
            {item.replyDetails?.createdAt ? formatReplyTimestamp(item.replyDetails.createdAt) : formatTimestamp(item.timestamp)}
          </Text>
          
          {item.replyDetails?.createdAt && (
            <Text style={styles.originalTimestamp}>
              Received: {formatTimestamp(item.timestamp)}
            </Text>
          )}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderRightActions = (item: NotificationItem) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => handleDeleteNotification(item.id)}
    >
      <Ionicons name="trash" size={24} color="#fff" />
      <Text style={styles.deleteText}>Delete</Text>
    </RectButton>
  );

  // This function is no longer needed as notifications are handled by useListenForReplies
  // Keeping for backward compatibility but it won't be called
  function addNotificationIfNew(reply: any) {
    // This is now handled by the useListenForReplies hook to prevent duplicates
    console.log('Legacy addNotificationIfNew called - this should not happen');
  }

  function saveNotificationsToStorage(notifications: NotificationItem[]) {
    AsyncStorage.setItem("notifications", JSON.stringify(notifications));
  }

  function formatTimestamp(ts: any): string {
    if (!ts) return "No date";
    try {
      if (
        typeof ts === "object" &&
        ts !== null &&
        typeof (ts as any).toDate === "function"
      ) {
        return (ts as any).toDate().toLocaleString();
      }
      if (typeof ts === "object" && ts.seconds) {
        return new Date(ts.seconds * 1000).toLocaleString();
      }
      if (typeof ts === "string" || typeof ts === "number") {
        const date = new Date(ts);
        return isNaN(date.getTime()) ? String(ts) : date.toLocaleString();
      }
      return String(ts);
    } catch {
      return "No date";
    }
  }

  const renderItem = ({ item }: { item: NotificationItem }) => {
    let displayTime = "No date";
    try {
      if (item.timestamp) {
        // Firestore Timestamp object
        if (
          typeof item.timestamp === "object" &&
          item.timestamp !== null &&
          typeof (item.timestamp as any).toDate === "function"
        ) {
          displayTime = (item.timestamp as any).toDate().toLocaleString();
        }
        // ISO string or number
        else if (
          typeof item.timestamp === "string" ||
          typeof item.timestamp === "number"
        ) {
          const date = new Date(item.timestamp);
          displayTime = isNaN(date.getTime())
            ? String(item.timestamp)
            : date.toLocaleString();
        }
        // Fallback for other objects
        else {
          displayTime = String(item.timestamp);
        }
      }
    } catch (e) {
      displayTime = "No date";
    }

    return (
      <View style={styles.notificationItem}>
        <View style={styles.iconCtn}>
          <Ionicons
            name={
              item.type === "incident-reply"
                ? "document-text"
                : item.replyDetails
                ? "chatbubble-ellipses"
                : "alert-circle"
            }
            size={28}
            color={
              item.type === "incident-reply"
                ? "#008080"
                : item.replyDetails
                ? "#121a68"
                : "#ff5330"
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>
            {typeof item.message === "string"
              ? item.message
              : JSON.stringify(item.message)}
          </Text>
          <Text style={styles.notificationTimestamp}>{displayTime}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {uniqueNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          <FlatList
            data={[...uniqueNotifications]
              .filter(item => {
                // Show all notifications - both push notifications and in-app notifications
                console.log('🔍 Filtering notification:', item.id, 'Type:', item.type, 'Has replyDetails:', !!item.replyDetails);
                return true; // Show all notifications for debugging
              })
              .sort((a, b) => {
                // Get timestamps for comparison - prioritize replyDetails.createdAt
                const getTimestamp = (item: NotificationItem) => {
                  // Use replyDetails.createdAt if available (more accurate for replies)
                  if (item.replyDetails?.createdAt) {
                    if (typeof item.replyDetails.createdAt === 'object' && item.replyDetails.createdAt.toDate) {
                      return item.replyDetails.createdAt.toDate().getTime();
                    }
                    if (typeof item.replyDetails.createdAt === 'object' && item.replyDetails.createdAt.seconds) {
                      return item.replyDetails.createdAt.seconds * 1000;
                    }
                  }
                  // Fall back to item timestamp
                  const timestamp = item.timestamp;
                  if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
                    return (timestamp as any).toDate().getTime();
                  }
                  if (typeof timestamp === 'object' && timestamp !== null && 'seconds' in timestamp) {
                    return (timestamp as any).seconds * 1000;
                  }
                  return new Date(timestamp).getTime();
                };
                
                const timeA = getTimestamp(a);
                const timeB = getTimestamp(b);
                
                // Sort by newest first (descending order)
                return timeB - timeA;
              })
            }
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7faf7ff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    color: "#aaa",
    fontSize: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCtn: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 2,
  },
  notificationMessage: {
    marginTop: 2,
    color: "#333",
    fontSize: 15,
  },
  notificationTimestamp: {
    marginTop: 6,
    fontSize: 12,
    color: "#888",
  },
  reply: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff5330",
  },
  alert: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff5330",
  },
  incidentReply: {
    borderLeftWidth: 4,
    borderLeftColor: "#008080", // Teal for incident replies
  },
  unread: {
    backgroundColor: "#f0f6ff",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#121a68",
    marginLeft: 8,
    alignSelf: "center",
  },
  deleteButton: {
    backgroundColor: "#ff5330",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: "row",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  header: { fontSize: 22, fontWeight: "bold", margin: 18, color: "#222" },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: { fontSize: 17, fontWeight: "bold", color: "#222" },
  message: { fontSize: 15, color: "#444", marginTop: 2 },
  time: { fontSize: 13, color: "#888", marginTop: 6 },
  
  // New notification card styles
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  responderInfo: {
    fontSize: 13,
    color: "#6b7280",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
  replyMessage: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 8,
  },
  replyTimestamp: {
    fontSize: 12,
    color: "#9ca3af",
  },
  originalTimestamp: {
    fontSize: 11,
    color: "#d1d5db",
    fontStyle: "italic",
  },
  alertIdText: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
});
