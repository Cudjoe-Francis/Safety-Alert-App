import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNotification } from "./context/NotificationContext";

const Notifications = () => {
  const { notifications } = useNotification();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>
              {item.timestamp.toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  notificationItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  message: { fontSize: 16 },
  timestamp: { fontSize: 12, color: "grey", marginTop: 4 },
});

export default Notifications;
