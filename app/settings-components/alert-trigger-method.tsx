import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const triggerMethods = [
  "Shake Phone",
  "Tap Emergency Button",
  "Voice Command (coming soon)",
  "Long Press on Screen",
];

const AlertTriggerMethodScreen = () => {

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
    <View
      style={
        styles.container
      }
    >
      

      <View style={styles.content}>
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
              style={
                styles.methodText
              }
            >
              {method}
            </Text>
          </Pressable>
        ))}

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Method</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AlertTriggerMethodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
