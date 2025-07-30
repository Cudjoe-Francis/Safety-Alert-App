import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useTheme } from "../../themeContext";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialIcons, FontAwesome5, AntDesign } from "@expo/vector-icons";

const Menu = () => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode? theme.background : theme.background }]}>
      
      <Text style={[styles.title, { color: theme.text }]}>Quick Access</Text>
    
    <ScrollView
      contentContainerStyle={{ paddingBottom: 50 }}
      style={{ backgroundColor: theme.background }}
    >

      <View style={styles.menuContainer}>
        {/* Emergency Contacts */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.card }]}
          onPress={() => router.push("/(menu-components)/emergency-contacts")}
        >
          <AntDesign name="contacts" size={24} color="#ff5330" />
          <Text style={[styles.cardText, { color: theme.text }]}>
            Emergency Contacts
          </Text>
        </TouchableOpacity>

        {/* History */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.card }]}
          onPress={() => router.push("/(menu-components)/history")}
        >
          <MaterialIcons name="history" size={24} color="#ff5330" />
          <Text style={[styles.cardText, { color: theme.text }]}>History</Text>
        </TouchableOpacity>

        {/* Incident Reports */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.card }]}
          onPress={() => router.push("/(menu-components)/incident-reports")}
        >
          <FontAwesome5 name="file-alt" size={22} color="#ff5330" />
          <Text style={[styles.cardText, { color: theme.text }]}>
            Incident Reports
          </Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.card }]}
          onPress={() => router.push("/(menu-components)/notifications")}
        >
          <Ionicons name="notifications-outline" size={24} color="#ff5330" />
          <Text style={[styles.cardText, { color: theme.text }]}>
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </ScrollView>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({

  container: { 
    flex: 1,
    paddingTop: 50,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 20,
    marginBottom: 12,
    paddingBottom: 8,
  },

  menuContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    gap: 15,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#000",
    elevation: 2,
    gap: 16,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
