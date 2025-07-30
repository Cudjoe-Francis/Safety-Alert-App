import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "..//../themeContext";

const triggerMethods = [
  "Shake Phone",
  "Tap Emergency Button",
  "Voice Command (coming soon)",
  "Long Press on Screen",
];

const AlertTriggerMethodScreen = () => {
  const { isDarkMode, theme } = useTheme();

  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleSave = () => {
    if (!selectedMethod) {
      Alert.alert("No method selected", "Please choose a trigger method.");
    } else {
      Alert.alert("Saved", `Selected: ${selectedMethod}`);
    }
  };

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
          Alert Trigger Method
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {triggerMethods.map((method) => (
          <Pressable
            key={method}
            style={styles.methodItem}
            onPress={() => handleSelect(method)}
          >
            <Ionicons
              name={
                selectedMethod === method
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={24}
              color="#ff5330"
              style={{ marginRight: 10 }}
            />
            <Text
              style={[
                styles.methodText,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {method}
            </Text>
          </Pressable>
        ))}

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Method</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AlertTriggerMethodScreen;

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
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    padding: 20,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  methodText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#ff5330",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
