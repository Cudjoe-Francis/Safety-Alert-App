import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import * as Location from "expo-location";
import { database } from "..//..//firebaseConfig";
import { ref, set } from "firebase/database";
import { useTheme } from "../../themeContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";


const IncidentReport = () => {
  const [problem, setProblem] = useState("");
  const { isDarkMode, theme } = useTheme();


  const navigation = useNavigation();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode
          ? offsetY > 23
            ? "#121212"
            : "#000"
          : "#fff",
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
        },
      });
    }, [isDarkMode, navigation])
  );


  const handleSubmit = () => {
    if (problem.trim() === "") {
      Alert.alert("Missing Details", "Please describe the problem.");
      return;
    }
    Alert.alert("Thank you!", "Your incident has been reported.");
    setProblem("");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.label, { color: theme.text }]}>
            Please describe the issue you’re experiencing. Be as detailed as
            possible to help us respond quickly.
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#23262f" : "#f9f9f9",
                color: isDarkMode ? "#fff" : "#222",
                borderColor: "#ff5330",
              },
            ]}
            multiline
            placeholder="Write your problem here..."
            placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
            value={problem}
            onChangeText={setProblem}
            maxLength={500}
          />
          <Text style={[styles.charCount, { color: isDarkMode ? "#888" : "#aaa" }]}>
            {problem.length}/500
          </Text>
          <Pressable
            style={[
              styles.button,
              { opacity: problem.trim() === "" ? 0.6 : 1 },
              isDarkMode && { backgroundColor: "#ff5330", shadowColor: "#000" },
            ]}
            onPress={handleSubmit}
            disabled={problem.trim() === ""}
          >
            <Ionicons
              name="send"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Submit Report</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default IncidentReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    height: 140,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 8,
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    marginBottom: 18,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#ff5330",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    shadowColor: "#ff5330",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 2,
  },
});
