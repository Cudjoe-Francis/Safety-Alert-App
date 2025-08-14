import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Constants from "expo-constants";

const VersionScreen = () => {
  const appVersion = Constants.expoConfig?.version ?? "N/A";
  const buildNumber =
    Constants.expoConfig?.extra?.eas?.buildNumber ??
    Constants.expoConfig?.ios?.buildNumber ??
    "N/A";

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Version:</Text>
          <Text style={styles.value}>{appVersion}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Build:</Text>
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
    backgroundColor: "#fff",
  },

  content: {
    padding: 25,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
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
    color: "#000",
  },
});
