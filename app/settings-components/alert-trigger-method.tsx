import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const triggerMethods = [
  {
    label: "Shake Phone",
    icon: <FontAwesome5 name="mobile-alt" size={22} color="#ff5330" />,
  },
  {
    label: "Tap Emergency Button",
    icon: <MaterialIcons name="touch-app" size={22} color="#ff5330" />,
  },
  {
    label: "Voice Command",
    icon: <MaterialIcons name="keyboard-voice" size={22} color="#ff5330" />,
  },
  {
    label: "Long Press on Screen",
    icon: <MaterialIcons name="pan-tool" size={22} color="#ff5330" />,
  },
];

const AlertTriggerMethodScreen = () => {
  const [selected, setSelected] = useState(triggerMethods[1].label);

  const handleSelect = (label: string) => {
    setSelected(label);
    // Save logic here (e.g., AsyncStorage or Firebase)
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <MaterialIcons name="flash-on" size={28} color="#ff5330" />
            <Text style={styles.title}>Alert Trigger Method</Text>
          </View>
          <Text style={styles.desc}>
            Choose how you want to trigger an emergency alert in the app.
          </Text>
          <View style={styles.optionsList}>
            {triggerMethods.map((method) => (
              <TouchableOpacity
                key={method.label}
                style={[
                  styles.option,
                  selected === method.label && styles.selectedOption,
                ]}
                onPress={() => handleSelect(method.label)}
                activeOpacity={0.8}
              >
                {method.icon}
                <Text
                  style={[
                    styles.optionText,
                    selected === method.label && styles.selectedOptionText,
                  ]}
                >
                  {method.label}
                </Text>
                {selected === method.label && (
                  <MaterialIcons
                    name="check-circle"
                    size={22}
                    color="#ff5330"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AlertTriggerMethodScreen;

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
  desc: {
    fontSize: 15,
    color: "#555",
    marginBottom: 18,
    lineHeight: 22,
  },
  optionsList: {
    width: "100%",
    marginTop: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f6f7fb",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#ff5330",
    borderColor: "#ff5330",
  },
  optionText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
    flex: 1,
    marginLeft: 12,
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
