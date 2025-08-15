import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const timerOptions = [
  "0 second",
  "5 seconds",
  "10 seconds",
  "15 seconds",
  "30 seconds",
  "120 seconds",
  "300 seconds",
];

const CountdownTimerScreen = () => {
  const router = useRouter();
  const [selectedTimer, setSelectedTimer] = useState<string | null>(null);

  // Load saved timer on mount
  useEffect(() => {
    const loadTimer = async () => {
      try {
        const savedTime = await AsyncStorage.getItem("countdownTimerLabel");
        if (savedTime) {
          setSelectedTimer(savedTime);
        } else {
          setSelectedTimer("10 seconds");
        }
      } catch (error) {
        console.error("Error loading timer:", error);
      }
    };
    loadTimer();
  }, []);

  const handleSelect = async (option: string) => {
    try {
      setSelectedTimer(option);
      await AsyncStorage.setItem("countdownTimerLabel", option);
      const timeInSeconds = parseInt(option);
      await AsyncStorage.setItem("countdownTimer", timeInSeconds.toString());
    } catch (error) {
      console.error("Error saving selected timer:", error);
    }
  };

  const handleSave = () => {
    if (!selectedTimer) {
      Alert.alert("No time selected", "Please select a countdown time.");
    } else {
      Alert.alert("Saved", `Countdown set to: ${selectedTimer}`);
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <MaterialIcons name="timer" size={28} color="#ff5330" />
            <Text style={styles.title}>Countdown Timer</Text>
          </View>
          <Text style={styles.desc}>
            Select how long the app should wait before sending an emergency
            alert after activation.
          </Text>
          <View style={styles.optionsList}>
            {timerOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  selectedTimer === option && styles.selectedOption,
                ]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedTimer === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
                {selectedTimer === option && (
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

export default CountdownTimerScreen;

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
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
