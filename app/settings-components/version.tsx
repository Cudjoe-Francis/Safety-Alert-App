import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const VersionScreen = () => {
  const appVersion = Constants.expoConfig?.version ?? "N/A";
  const buildNumber =
    Constants.expoConfig?.extra?.eas?.buildNumber ??
    Constants.expoConfig?.ios?.buildNumber ??
    "N/A";

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconRow}>
          <MaterialIcons name="verified" size={32} color="#ff5330" />
          <Text style={styles.title}>App Version Info</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>{appVersion}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Build</Text>
          <Text style={styles.value}>{buildNumber}</Text>
        </View>
      </View>
    </View>
  );
};

export default VersionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    width: "90%",
    elevation: 6,
    shadowColor: "#ff5330",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    bottom: 50,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#ff5330",
    fontWeight: "bold",
  },
});
