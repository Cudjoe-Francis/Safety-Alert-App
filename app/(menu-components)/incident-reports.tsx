import { getAuth } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../themeContext";
import { sendIncidentReport } from "../../utils/sendIncidentReport";

const IncidentReport = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme, isDarkMode } = useTheme();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Fetch user details and emergency contacts from Realtime DB
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userDetails = snapshot.val();

      if (!userDetails) throw new Error("User details not found");

      const reportData = {
        userId: user.uid,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        homeAddress: userDetails.homeAddress,
        dateOfBirth: userDetails.dateOfBirth,
        bloodType: userDetails.bloodType,
        medicalCondition: userDetails.medicalCondition,
        allergies: userDetails.allergies,
        gender: userDetails.gender,
        phoneNumber: userDetails.phoneNumber,
        occupation: userDetails.occupation,
        email: userDetails.email,
        emergencyContacts: userDetails.emergencyContacts || [],
        message,
        serviceType: "police",
      };

      await sendIncidentReport(reportData);
      Alert.alert(
        "Report Submitted",
        "Your incident report has been sent to the police."
      );
      setMessage("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to submit report.");
    }
    setLoading(false);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? theme.card : theme.background },
      ]}
    >
      <Text style={styles.title}>Describe the Incident</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={5}
        placeholder="Type your incident report here..."
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading || !message.trim()}
      >
        <Text style={styles.submitText}>
          {loading ? "Submitting..." : "Submit Report"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default IncidentReport;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#222" },
  input: {
    borderWidth: 1,
    borderColor: "#ff5330",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 18,
    minHeight: 100,
    color: "#222",
  },
  submitButton: {
    backgroundColor: "#121a68",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
