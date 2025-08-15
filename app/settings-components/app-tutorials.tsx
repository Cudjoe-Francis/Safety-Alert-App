import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const tutorials = [
  {
    step: "1",
    title: "Sign Up & Profile Setup",
    description:
      "Create your account and complete your profile for personalized emergency assistance.",
  },
  {
    step: "2",
    title: "Add Emergency Contacts",
    description:
      "Go to Emergency Contacts and add trusted people who will be notified in emergencies.",
  },
  {
    step: "3",
    title: "Using the SOS Button",
    description:
      "Press the SOS button to quickly alert your contacts. The app will open your SMS app with a pre-filled message.",
  },
  {
    step: "4",
    title: "Find Help Nearby",
    description:
      "Use the Find Help feature to locate nearby hospitals or police stations instantly.",
  },
  {
    step: "5",
    title: "Customize Settings",
    description:
      "Adjust preferences, countdown timer, and SOS message in the Settings menu.",
  },
];

const AppTutorial = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* <View style={styles.headerRow}>
            <MaterialIcons name="school" size={28} color="#ff5330" />
            <Text style={styles.title}>App Tutorials</Text>
          </View> */}
          {tutorials.map((item, idx) => (
            <View key={idx} style={styles.tutorialItem}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepText}>{item.step}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tutorialTitle}>{item.title}</Text>
                <Text style={styles.tutorialDesc}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AppTutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    // justifyContent: "center",

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
  tutorialItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ff5330",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    marginTop: 2,
    elevation: 2,
  },
  stepText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  tutorialDesc: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
});
