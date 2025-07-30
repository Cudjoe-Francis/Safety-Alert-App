import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback, // Import TouchableWithoutFeedback
  Keyboard, // Import Keyboard
  KeyboardAvoidingView, // Import KeyboardAvoidingView
  Platform, // Import Platform to handle different OS behaviors for KeyboardAvoidingView
  ScrollView, // Import ScrollView
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { replace } from "expo-router/build/global-state/routing"; // This import might need adjustment based on your actual expo-router setup

const SignUp = () => {
  // State variables for email and password
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // State variables for error messages
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  /**
   * Validates the email format.
   * @param email The email string to validate.
   * @returns True if the email is valid, false otherwise.
   */
  const validateEmail = (email: string): boolean => {
    // Basic email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required.");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError(""); // Clear error if valid
    return true;
  };

  /**
   * Validates the password.
   * @param password The password string to validate.
   * @returns True if the password is valid, false otherwise.
   */
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required.");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    }
    setPasswordError(""); // Clear error if valid
    return true;
  };

  /**
   * Handles the sign-in button press, performing validation.
   */
  const handleSignIn = () => {
    // Validate both fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    // If both are valid, proceed with sign-in logic (e.g., API call, navigation)
    if (isEmailValid && isPasswordValid) {
      console.log("Sign In successful:", { email, password });
      // In a real app, you would dispatch an action or make an API call here.
      // For this example, we'll just navigate.
      replace("/(tabs)"); // Navigate to the home screen
    } else {
      console.log("Validation failed.");
    }
  };

  return (
    // Wrap the entire content with TouchableWithoutFeedback to dismiss keyboard on tap
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        {/* KeyboardAvoidingView to adjust layout when keyboard appears */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"} // 'padding' for iOS, 'height' for Android
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust this offset if content is still hidden
        >
          <View style={styles.createAcc}>
            <Text style={styles.createAccText}>Hello Sign In!</Text>
          </View>

          {/* Form container wrapped in ScrollView */}
          <ScrollView
            contentContainerStyle={styles.scrollViewContent} // Use contentContainerStyle for ScrollView
            keyboardShouldPersistTaps="handled" // Ensures taps outside inputs dismiss keyboard
          >
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome Back</Text>

              <Text style={styles.text}>Email</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]} // Apply error style
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  // Clear error as user types, or re-validate on change
                  if (emailError) validateEmail(text);
                }}
                onBlur={() => validateEmail(email)} // Validate on blur
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <Text style={styles.text}>Password</Text>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]} // Apply error style
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  // Clear error as user types, or re-validate on change
                  if (passwordError) validatePassword(text);
                }}
                onBlur={() => validatePassword(password)} // Validate on blur
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}

              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signUpBtn} onPress={handleSignIn}>
                <Text style={styles.btnText}>SIGN IN</Text>
              </TouchableOpacity>

              <View style={styles.signInContainer}>
                <Text>Don`t have an account?</Text>
                <TouchableOpacity onPress={() => replace("/signup")}>
                  <Text style={styles.signInText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <StatusBar style="light" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#ff5330",
    flex: 1,
  },

  createAcc: {
    paddingBottom: 80,
    paddingTop: 16,
    paddingHorizontal: 20,
  },

  createAccText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    width: 80,
  },

  // Added for ScrollView to ensure content fills space
  scrollViewContent: {
    flexGrow: 1, // Allows content to grow and push elements to bottom if needed
    justifyContent: "space-between", // Distributes space evenly
  },

  formContainer: {
    flex: 1, // Allows form to take available space within ScrollView
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 40,
    // Removed marginBottom: -50 as it can interfere with KeyboardAvoidingView and ScrollView
  },

  welcomeText: {
    fontSize: 22,
    paddingBottom: 70,
    textAlign: "center",
    fontWeight: "bold",
  },

  text: {
    color: "#ff5330",
  },

  input: {
    borderBottomWidth: 1,
    marginBottom: 28, // Adjusted to make space for error message
    fontSize: 20,
    borderColor: "#949494",
  },
  inputError: {
    borderColor: "red", // Highlight input border in red on error
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -20, // Pull it up closer to the input
    marginBottom: 10, // Add some space below the error
  },

  forgotPasswordText: {
    marginTop: -10,
    textAlign: "right",
    color: "#FF5330",
  },

  signInContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signUpBtn: {
    backgroundColor: "#ff5330",
    borderRadius: 20,
    marginTop: 120,
    paddingVertical: 10,
    width: 340,
    alignSelf: "center",
    marginBottom: 20,
  },

  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  signInText: {
    color: "#ff5330",
  },
});
