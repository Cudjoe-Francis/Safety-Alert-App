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

type NotificationItem = {
  id: string;
  message: string;
  timestamp: string;
  replyDetails?: any;
  type?: "alert-reply" | "incident-reply";
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { notifications: appNotifications } = useNotification(); // <-- Get in-app notifications

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
        const newNotification: NotificationItem = {
          id: notification.request.identifier + "-" + uuid.v4(), // Ensures uniqueness
          title: notification.request.content.title || "Security Alert",
          message:
            notification.request.content.body || "Message from responder.",
          timestamp: new Date().toLocaleString(),
          replyDetails: notification.request.content.data?.reply, // <-- Add this if available
        };

        setNotifications((prev) => [newNotification, ...prev]);
      }
    );

    return () => {
      subscriptionReceived.remove();
    };
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) return;

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
          repliesSnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const replyData = change.doc.data();
              replyData.id = change.doc.id;
              addNotificationIfNew(replyData);
            }
          });
        });
      });
    });

    return () => {
      unsubscribeAlerts();
    };
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("notifications").then((data) => {
      if (data) {
        setNotifications(JSON.parse(data));
      }
    });
  }, []);

  useListenForReplies();

  // Combine push notifications and app notifications
  const allNotifications = [
    ...appNotifications.map((n) => ({
      id: n.id.toString(),
      title: "App Alert",
      message:
        typeof n.message === "string" ? n.message : JSON.stringify(n.message),
      timestamp:
        typeof n.timestamp === "string"
          ? n.timestamp
          : n.timestamp.toLocaleString(),
      replyDetails: n.replyDetails || undefined, // <-- Add this line
    })),
    ...notifications,
  ];

  const uniqueNotifications = Array.from(
    new Map(notifications.map((n) => [n.id, n])).values()
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
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === item.id ? { ...n, read: true } : n
      );
      saveNotificationsToStorage(updated);
      return updated;
    });
    if (item.replyDetails) {
      router.push({
        pathname: "/(menu-components)/ReplyDetails",
        params: { reply: JSON.stringify(item.replyDetails) },
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

    // Also delete from Firestore if it's a reply
    try {
      // Find the notification to get alertId and replyId
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

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        style={[
          styles.notificationItem,
          item.type === "incident-reply"
            ? styles.incidentReply
            : item.replyDetails
            ? styles.reply
            : styles.alert,
          !item.read && styles.unread,
        ]}
        activeOpacity={0.8}
      >
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
          <Text style={styles.notificationTimestamp}>
            {typeof item.timestamp === "string"
              ? item.timestamp
              : typeof item.timestamp === "object" &&
                typeof item.timestamp.toLocaleString === "function"
              ? item.timestamp.toLocaleString()
              : ""}
          </Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    </Swipeable>
  );

  const renderRightActions = (item: NotificationItem) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => handleDeleteNotification(item.id)}
    >
      <Ionicons name="trash" size={24} color="#fff" />
      <Text style={styles.deleteText}>Delete</Text>
    </RectButton>
  );

  function addNotificationIfNew(reply: any) {
    setNotifications((prev: NotificationItem[]) => {
      if (prev.some((n) => n.id === reply.id)) {
        return prev;
      }

      const updated = [
        {
          id: reply.id,
          title: "Reply",
          message: reply.message,
          timestamp:
            reply.time && typeof reply.time.toDate === "function"
              ? reply.time.toDate().toLocaleString()
              : typeof reply.timestamp === "string"
              ? reply.timestamp
              : typeof reply.timestamp === "object" &&
                typeof reply.timestamp.toDate === "function"
              ? reply.timestamp.toDate().toLocaleString()
              : new Date().toLocaleString(),
          replyDetails: reply,
          read: false,
        },
        ...prev,
      ];
      saveNotificationsToStorage(updated);
      return updated;
    });
  }

  function saveNotificationsToStorage(notifications: NotificationItem[]) {
    AsyncStorage.setItem("notifications", JSON.stringify(notifications));
  }

  // const { notifications } = useNotification();

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.card}>
      <Ionicons
        name={item.type === "incident-reply" ? "alert-circle" : "chatbox"}
        size={28}
        color={item.type === "incident-reply" ? "#ff5330" : "#121a68"}
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>
          {item.type === "incident-reply"
            ? "Police Reply (Incident Report)"
            : "Emergency Service Reply"}
        </Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>
          {item.timestamp ? new Date(item.timestamp).toLocaleString() : ""}
        </Text>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          <FlatList
            data={[...uniqueNotifications].sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

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
    borderLeftColor: "#121a68",
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
});

export default NotificationScreen;
