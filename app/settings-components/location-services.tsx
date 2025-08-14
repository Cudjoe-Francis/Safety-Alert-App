import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Linking,
  Alert,
  Platform,
} from "react-native";

const LocationServicesScreen = () => {
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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          The Safety Alert App uses your location to:
          {"\n\n"}• Notify security agencies of your exact position
          {"\n"}• Help responders reach you faster
          {"\n\n"}You can enable or disable location access in your device`s
          settings.
        </Text>

        <Pressable style={styles.button} onPress={openLocationSettings}>
          <Text style={styles.buttonText}>Open Location Settings</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default LocationServicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff5330",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
