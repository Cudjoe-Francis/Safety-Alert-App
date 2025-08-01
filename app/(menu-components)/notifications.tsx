import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNotification } from "../context/NotificationContext"; // <-- Add this import

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { notifications: appNotifications } = useNotification(); // <-- Get in-app notifications

  useEffect(() => {
    animateIn();

    // Listener for received push notifications
    const subscriptionReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        const newNotification: NotificationItem = {
          id: notification.request.identifier,
          title: notification.request.content.title || "Security Alert",
          message:
            notification.request.content.body || "Message from responder.",
          timestamp: new Date().toLocaleString(),
        };

        setNotifications((prev) => [newNotification, ...prev]);
      }
    );

    return () => {
      subscriptionReceived.remove();
    };
  }, []);

  // Combine push notifications and app notifications
  const allNotifications = [
    ...appNotifications.map((n) => ({
      id: n.id.toString(),
      title: "App Alert",
      message: n.message,
      timestamp: n.timestamp.toLocaleString(),
    })),
    ...notifications,
  ];

  const animateIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {allNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={allNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    color: "#aaa",
  },
  listContent: {
    padding: 10,
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  notificationTitle: {
    fontWeight: "bold",
  },
  notificationMessage: {
    marginTop: 5,
    color: "#333",
  },
  notificationTimestamp: {
    marginTop: 5,
    fontSize: 12,
    color: "#aaa",
  },
});

export default NotificationScreen;
