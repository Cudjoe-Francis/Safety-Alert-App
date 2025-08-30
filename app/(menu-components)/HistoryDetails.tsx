import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const serviceColors: Record<string, string> = {
  police: "#121a68",
  hospital: "#008000",
  fire: "red",
  campus: "#5d3fd3",
  incident: "#ff5330",
  sos: "#ff5330",
};

const HistoryDetails = () => {
  const { history } = useLocalSearchParams();
  const historyObj = history ? JSON.parse(history as string) : {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name={
            historyObj.type === "incident"
              ? "alert-circle"
              : historyObj.type === "sos"
              ? "call"
              : historyObj.type === "police"
              ? "shield"
              : historyObj.type === "hospital"
              ? "medkit"
              : historyObj.type === "fire"
              ? "flame"
              : historyObj.type === "campus"
              ? "school"
              : "document"
          }
          size={38}
          color={serviceColors[historyObj.type] || "#888"}
          style={{ marginRight: 12 }}
        />
        <Text style={styles.title}>
          {historyObj.type === "incident"
            ? "Incident Report"
            : historyObj.type === "sos"
            ? "SOS Alert"
            : historyObj.serviceType?.charAt(0).toUpperCase() +
              historyObj.serviceType?.slice(1)}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Message:</Text>
        <Text style={styles.value}>{historyObj.message || "No message"}</Text>
      </View>
      {historyObj.location && (
        <View style={styles.section}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>
            {historyObj.location.address || "Unknown address"}
          </Text>
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>
          {historyObj.time
            ? typeof historyObj.time === "object" && historyObj.time.seconds
              ? new Date(historyObj.time.seconds * 1000).toLocaleString()
              : typeof historyObj.time === "number"
              ? new Date(historyObj.time).toLocaleString()
              : ""
            : ""}
        </Text>
      </View>
      {historyObj.contacts && (
        <View style={styles.section}>
          <Text style={styles.label}>Contacts:</Text>
          <Text style={styles.value}>
            {Array.isArray(historyObj.contacts)
              ? historyObj.contacts.join(", ")
              : historyObj.contacts}
          </Text>
        </View>
      )}
      {historyObj.reply && (
        <View style={styles.section}>
          <Text style={styles.label}>Reply:</Text>
          <Text style={styles.value}>{historyObj.reply.message}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  label: { fontSize: 16, color: "#888", marginBottom: 4, fontWeight: "600" },
  value: { fontSize: 18, color: "#222" },
});

export default HistoryDetails;
