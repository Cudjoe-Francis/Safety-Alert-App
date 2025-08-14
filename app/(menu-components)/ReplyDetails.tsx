import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ReplyDetails = () => {
  const { reply, time } = useLocalSearchParams();
  const replyObj = reply ? JSON.parse(reply as string) : {};

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Responder:</Text>
      <Text style={styles.value}>{replyObj.responderName || "Unknown"}</Text>
      <Text style={styles.label}>Station:</Text>
      <Text style={styles.value}>{replyObj.station || "N/A"}</Text>

      {replyObj.incident ? (
        <>
          <Text style={styles.label}>Incident Report:</Text>
          <Text style={styles.value}>{replyObj.incident.description}</Text>
          <Text style={styles.label}>Reported At:</Text>
          <Text style={styles.value}>
            {replyObj.incident.time
              ? new Date(replyObj.incident.time.seconds * 1000).toLocaleString()
              : ""}
          </Text>
          <Text style={styles.label}>Reply:</Text>
          <Text style={styles.value}>{replyObj.message}</Text>
          <Text style={styles.label}>Reply Time:</Text>
          <Text style={styles.value}>
            {replyObj.timestamp
              ? new Date(replyObj.timestamp.seconds * 1000).toLocaleString()
              : ""}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Message:</Text>
          <Text style={styles.value}>{replyObj.message}</Text>
            <Text style={styles.label}>Received at:</Text>
            <Text style={styles.value}>{time || ""}</Text>
          <Text style={styles.value}>
            {replyObj.timestamp
              ? new Date(replyObj.timestamp.seconds * 1000).toLocaleString()
              : ""}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, color: "#888", marginTop: 20 },
  value: { fontSize: 18, color: "#222", marginTop: 6 },
});

export default ReplyDetails;
