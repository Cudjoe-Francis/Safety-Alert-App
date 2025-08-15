import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

const preferences = [
  { key: "location", label: "Enable Location Services" },
  { key: "notifications", label: "Enable Notifications" },
  { key: "darkMode", label: "Enable Dark Mode" },
  { key: "autoSOS", label: "Enable Auto SOS" },
];

const EnablePreferencesScreen = () => {
  const [enabled, setEnabled] = useState({
    location: true,
    notifications: true,
    darkMode: false,
    autoSOS: false,
  });

  const toggleSwitch = (key: string) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <MaterialIcons name="settings" size={28} color="#ff5330" />
            <Text style={styles.title}>Preferences</Text>
          </View>
          {preferences.map((pref) => (
            <View key={pref.key} style={styles.prefRow}>
              <Text style={styles.prefLabel}>{pref.label}</Text>
              <Switch
                value={enabled[pref.key]}
                onValueChange={() => toggleSwitch(pref.key)}
                trackColor={{ false: "#eee", true: "#ff5330" }}
                thumbColor={enabled[pref.key] ? "#fff" : "#ccc"}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default EnablePreferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    justifyContent: "center",
    // alignItems: "center",
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    width: "100%",
    maxWidth: 400,
    elevation: 6,
    shadowColor: "#ff5330",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  headerRow: {
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
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  prefLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
  },
});
