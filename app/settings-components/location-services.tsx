import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LocationServicesScreen = () => {
  const [enabled, setEnabled] = useState(true);
  const [locationStatus, setLocationStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationStatus(status);
      setEnabled(status === "granted");
    })();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationStatus(status);
    setEnabled(status === "granted");
    if (status !== "granted") {
      Alert.alert(
        "Location Required",
        "Please enable location services in your device settings.",
        [
          {
            text: "Open Settings",
            onPress: openLocationSettings,
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  const toggleSwitch = async () => {
    if (!enabled) {
      await requestLocationPermission();
    } else {
      Alert.alert(
        "Location",
        "To turn off location, please disable it in your device settings.",
        [
          {
            text: "Open Settings",
            onPress: openLocationSettings,
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  const openLocationSettings = async () => {
    try {
      if (Platform.OS === "ios") {
        await Linking.openURL("App-Prefs:Privacy&path=LOCATION");
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open settings.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        
        <Text style={styles.desc}>
          Enable location services to allow the app to find your current
          position and help you in emergencies.
        </Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>
            {enabled ? "Enabled" : "Disabled"}
          </Text>
          <Switch
            value={enabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: "#eee", true: "#ff5330" }}
            thumbColor={enabled ? "#fff" : "#ccc"}
          />
        </View>
        <TouchableOpacity
          style={styles.infoBtn}
          activeOpacity={0.7}
          onPress={openLocationSettings}
        >
          <MaterialIcons name="info-outline" size={20} color="#ff5330" />
          <Text style={styles.infoText}>
            Your location is only used for emergency assistance and is never
            shared without your consent.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationServicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    width: "90%",
    maxWidth: 400,
    elevation: 6,
    shadowColor: "#ff5330",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    bottom: 50,
  },

  desc: {
    fontSize: 15,
    color: "#555",
    marginBottom: 18,
    lineHeight: 22,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
  },
  infoBtn: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    backgroundColor: "#f6f7fb",
    borderRadius: 8,
    padding: 10,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#888",
    flex: 1,
    lineHeight: 20,
  },
});
