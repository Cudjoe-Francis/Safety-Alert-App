import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const tips = [
  "Always share your location with trusted contacts when heading out.",
  "Keep emergency contacts updated in your app profile.",
  "If you feel unsafe, use the SOS button to alert your contacts immediately.",
  "Stay aware of your surroundings and avoid poorly lit or isolated areas.",
  "Report suspicious activities or incidents to authorities using the app.",
  "Keep your phone charged and accessible at all times.",
  "Know the nearest hospital, police station, and fire service locations.",
  "Do not hesitate to request help if you feel threatened or unwell.",
  "Review your medical info and allergies in your profile for emergencies.",
  "Practice regular check-ins with friends or family when traveling alone.",
];

const SafetyTips = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {tips.map((tip, idx) => (
        <View key={idx} style={styles.tipBox}>
          <Text style={styles.tipNumber}>{idx + 1}.</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default SafetyTips;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
 
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    elevation: 1,
  },
  tipNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff5330",
    marginRight: 8,
  },
  tipText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
});
