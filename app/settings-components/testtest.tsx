import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from '..//../themeContext';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Home = () => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: theme.text }]}>
          Welcome Back
        </Text>
        <Text style={[styles.subText, { color: theme.text }]}>
          Stay safe and alert
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Actions
          </Text>

          <View style={styles.cardRow}>
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: theme.card,
                  shadowColor: isDarkMode ? "#000" : "#ccc",
                },
              ]}
              onPress={() => router.push("/(menu-components)/emergency-contacts")}
            >
              <MaterialCommunityIcons
                name="account-alert-outline"
                size={24}
                color="#ff5330"
              />
              <Text style={[styles.cardText, { color: theme.text }]}>
                Emergency
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: theme.card,
                  shadowColor: isDarkMode ? "#000" : "#ccc",
                },
              ]}
              onPress={() => router.push("/(menu-components)/incident-reports")}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={24}
                color="#ff5330"
              />
              <Text style={[styles.cardText, { color: theme.text }]}>
                Report
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Notifications
          </Text>
          <View
            style={[
              styles.notificationBox,
              {
                backgroundColor: isDarkMode ? "#2c2c2e" : "#f0f0f0",
                borderColor: isDarkMode ? "#3a3a3c" : "#ddd",
              },
            ]}
          >
            <Ionicons
              name="notifications"
              size={20}
              color="#ff5330"
              style={{ marginRight: 10 }}
            />
            <Text style={[styles.notificationText, { color: theme.text }]}>
              No new alerts
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
  },
  subText: {
    fontSize: 16,
    marginTop: 4,
  },
  scrollContainer: {
    paddingBottom: 60,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  card: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  notificationBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  notificationText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
