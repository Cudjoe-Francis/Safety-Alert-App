import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ReplyDetails = () => {
  const { reply } = useLocalSearchParams();
  const replyObj = reply ? JSON.parse(reply as string) : {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reply Details</Text>
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
          <Text style={styles.label}>Time:</Text>
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
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, color: "#888", marginTop: 12 },
  value: { fontSize: 18, color: "#222", marginTop: 2 },
});

export default ReplyDetails;
