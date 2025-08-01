import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "..//../themeContext";

const TermsAndConditionsScreen = () => {
  const { isDarkMode, theme } = useTheme();

  const router = useRouter();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? theme.card : theme.background },
      ]}
    >
      <View
        style={[
          styles.header,
          { borderColor: isDarkMode ? "#363636" : "#eee" },
        ]}
      >
        <Pressable onPress={router.back} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#ff5330" />
        </Pressable>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
          Terms & Conditions
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>
          By using the Safety Alert App, you agree to the following terms:
          {"\n\n"}
          1. You will use the app for emergency purposes only.{"\n\n"}
          2. You consent to the use of location data during alerts.{"\n\n"}
          3. We are not liable for any misuse of the app or failure of
          third-party services.{"\n\n"}
          4. These terms may change without notice.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
});
