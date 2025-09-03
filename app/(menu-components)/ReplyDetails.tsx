import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function formatTimestamp(ts: any): string {
  if (!ts) return "";
  try {
    if (
      typeof ts === "object" &&
      ts !== null &&
      typeof ts.toDate === "function"
    ) {
      return ts.toDate().toLocaleString();
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
    return "";
  }
}

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
            {formatTimestamp(replyObj.incident.time)}
          </Text>
          <Text style={styles.label}>Reply:</Text>
          <Text style={styles.value}>{replyObj.message}</Text>
          <Text style={styles.label}>Reply Time:</Text>
          <Text style={styles.value}>
            {formatTimestamp(replyObj.timestamp)}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Message:</Text>
          <Text style={styles.value}>{replyObj.message}</Text>
          <Text style={styles.label}>Received at:</Text>
          <Text style={styles.value}>{time || ""}</Text>
          <Text style={styles.value}>
            {formatTimestamp(replyObj.timestamp)}
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
