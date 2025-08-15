import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SosMessageCustomization = () => {
  const [sosMessage, setSosMessage] = useState("Hello Family, I’m in danger");
  const [alertMessage, setAlertMessage] = useState(
    "I need emergency assistance at my location."
  );

  const handleSaveSos = () => {
    // Save logic here (e.g., AsyncStorage or Firebase)
    Alert.alert("Saved", "Your SOS message has been updated.");
  };

  const handleSaveAlert = () => {
    // Save logic here (e.g., AsyncStorage or Firebase)
    Alert.alert(
      "Saved",
      "Your emergency service alert message has been updated."
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <MaterialIcons name="sms" size={28} color="#ff5330" />
            <Text style={styles.title}>Customize SOS Message</Text>
          </View>
          <Text style={styles.desc}>
            Edit the message that will be sent to your emergency contacts when
            you press the SOS button.
          </Text>
          <TextInput
            style={styles.input}
            value={sosMessage}
            onChangeText={setSosMessage}
            multiline
            maxLength={160}
            placeholder="Type your SOS message here..."
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveSos}>
            <Text style={styles.buttonText}>Save SOS Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <MaterialIcons
              name="notification-important"
              size={28}
              color="#ff5330"
            />
            <Text style={styles.title}>Customize Emergency Alert Message</Text>
          </View>
          <Text style={styles.desc}>
            Edit the message that will be sent when you request help from
            emergency services.
          </Text>
          <TextInput
            style={styles.input}
            value={alertMessage}
            onChangeText={setAlertMessage}
            multiline
            maxLength={160}
            placeholder="Type your emergency alert message here..."
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveAlert}>
            <Text style={styles.buttonText}>Save Alert Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SosMessageCustomization;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  scrollContent: {
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
    marginBottom: 28,
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
  input: {
    backgroundColor: "#f6f7fb",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#222",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 18,
    minHeight: 60,
    maxHeight: 120,
  },
  button: {
    backgroundColor: "#ff5330",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
