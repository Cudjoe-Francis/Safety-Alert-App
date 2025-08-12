import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const tips = [
  {
    icon: "shield-checkmark",
    title: "Stay Alert",
    description:
      "Always be aware of your surroundings, especially in unfamiliar areas.",
  },
  {
    icon: "call",
    title: "Emergency Contacts",
    description: "Keep your emergency contacts updated and easily accessible.",
  },
  {
    icon: "walk",
    title: "Travel Safely",
    description: "Avoid walking alone at night and use well-lit routes.",
  },
  {
    icon: "medkit",
    title: "Medical Info",
    description: "Carry essential medical information and supplies if needed.",
  },
  {
    icon: "location",
    title: "Share Location",
    description: "Let trusted people know your location when heading out.",
  },
];

const SafetyTipsScreen = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={{ paddingBottom: 40 }}
  >
    {tips.map((tip, idx) => (
      <View key={idx} style={styles.card}>
        <Ionicons
          name={tip.icon as any}
          size={32}
          color="#121a68"
          style={styles.icon}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{tip.title}</Text>
          <Text style={styles.desc}>{tip.description}</Text>
        </View>
      </View>
    ))}
  </ScrollView>
);

export default SafetyTipsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingTop: 18 },
  card: {
    flexDirection: "row",
    alignItems: "center",
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
    borderLeftWidth: 4,
    borderLeftColor: "#ff5330",
  },
  icon: { marginRight: 18 },
  title: { fontSize: 17, fontWeight: "bold", color: "#222" },
  desc: { fontSize: 15, color: "#444", marginTop: 2 },
});
