import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const tips = [

  {
    icon: "alert-circle-outline",
    title: "Be Cautious",
    description:
      "Always be cautious and aware of your surroundings, especially in unfamiliar places.",
  },
  {
    icon: "location",
    title: "Share Location",
    description: "Let trusted people know your location when heading out.",
  },
  {
    icon: "medkit",
    title: "Medical Info",
    description: "Carry essential medical information and supplies if needed.",
  },
  {
    icon: "person-outline",
    title: "Stay Connected",
    description:
      "Keep in touch with friends or family when traveling alone or in new areas.",
  },
  {
    icon: "phone-portrait-outline",
    title: "Emergency Contacts",
    description:
      "Have a list of emergency contacts readily available on your phone.",
  },
  {
    icon: "map-outline",
    title: "Know Your Location",
    description:
      "Familiarize yourself with the area and know where to find help if needed.",
  },

  {
    icon: "person",
    title: "Travel in Groups",
    description:
      "Whenever possible, travel with friends or in groups to enhance safety.",
  },

  {
    icon: "alert",
    title: "Stay Informed",
    description:
      "Keep up with local news and alerts to stay aware of any safety concerns.",
  },
  {
    icon: "shield",
    title: "Use Trusted Apps",
    description:
      "Only use trusted apps for navigation and communication to ensure your safety.",
  },

  {
    icon: "alert-circle",
    title: "Emergency Preparedness",
    description:
      "Always have a plan for emergencies, including knowing exits and having a first aid kit.",
  },
  {
    icon: "lock-closed",
    title: "Secure Your Belongings",
    description:
      "Keep your personal items secure and avoid displaying valuables in public.",
  },

  {
    icon: "walk",
    title: "Travel Safely",
    description: "Avoid walking alone at night and use well-lit routes.",
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
