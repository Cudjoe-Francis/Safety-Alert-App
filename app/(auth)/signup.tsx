import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView, // Import ScrollView
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { replace } from "expo-router/build/global-state/routing";

const SignUp = () => {
  // State variables for form fields
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // State variables for error messages
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  /**
   * Validates a generic text input (e.g., first name, last name).
   * @param value The string value to validate.
   * @param fieldName The name of the field for error messages.
   * @param setError The state setter for the error message.
   * @returns True if the value is valid, false otherwise.
   */
  const validateTextInput = (
    value: string,
    fieldName: string,
    setError: React.Dispatch<React.SetStateAction<string>>
  ): boolean => {
    if (!value.trim()) {
      setError(`${fieldName} is required.`);
      return false;
    }
    setError("");
    return true;
  };

  /**
   * Validates the email format.
   * @param email The email string to validate.
   * @returns True if the email is valid, false otherwise.
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required.");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
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
    setPasswordError("");
    return true;
  };

  /**
   * Validates the confirm password field.
   * @param confirmPass The confirm password string to validate.
   * @param originalPass The original password string for comparison.
   * @returns True if the confirm password is valid and matches, false otherwise.
   */
  const validateConfirmPassword = (
    confirmPass: string,
    originalPass: string
  ): boolean => {
    if (!confirmPass) {
      setConfirmPasswordError("Confirm Password is required.");
      return false;
    } else if (confirmPass !== originalPass) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  /**
   * Handles the sign-up button press, performing all validations.
   */
  const handleSignUp = () => {
    // Perform all validations
    const isFirstNameValid = validateTextInput(
      firstName,
      "First Name",
      setFirstNameError
    );
    const isLastNameValid = validateTextInput(
      lastName,
      "Last Name",
      setLastNameError
    );
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(
      confirmPassword,
      password
    );

    // If all fields are valid, proceed with sign-up logic
    if (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      console.log("Sign Up successful:", {
        firstName,
        lastName,
        email,
        password,
      });
      // In a real app, you would dispatch an action or make an API call here.
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
            <Text style={styles.createAccText}>Create Your Account</Text>
          </View>

          {/* Form container wrapped in ScrollView */}
          <ScrollView
            contentContainerStyle={styles.scrollViewContent} // Use contentContainerStyle for ScrollView
            keyboardShouldPersistTaps="handled" // Ensures taps outside inputs dismiss keyboard
          >
            <View style={styles.formContainer}>
              <Text style={styles.text}>First Name</Text>
              <TextInput
                style={[
                  styles.input,
                  firstNameError ? styles.inputError : null,
                ]}
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (firstNameError)
                    validateTextInput(text, "First Name", setFirstNameError);
                }}
                onBlur={() =>
                  validateTextInput(firstName, "First Name", setFirstNameError)
                }
              />
              {firstNameError ? (
                <Text style={styles.errorText}>{firstNameError}</Text>
              ) : null}

              <Text style={styles.text}>Last Name</Text>
              <TextInput
                style={[
                  styles.input,
                  lastNameError ? styles.inputError : null,
                ]}
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (lastNameError)
                    validateTextInput(text, "Last Name", setLastNameError);
                }}
                onBlur={() =>
                  validateTextInput(lastName, "Last Name", setLastNameError)
                }
              />
              {lastNameError ? (
                <Text style={styles.errorText}>{lastNameError}</Text>
              ) : null}

              <Text style={styles.text}>Email</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                }}
                onBlur={() => validateEmail(email)}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <Text style={styles.text}>Password</Text>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                }}
                onBlur={() => validatePassword(password)}
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}

              <Text style={styles.text}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  confirmPasswordError ? styles.inputError : null,
                ]}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError)
                    validateConfirmPassword(text, password);
                }}
                onBlur={() =>
                  validateConfirmPassword(confirmPassword, password)
                }
              />
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}

              <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
                <Text style={styles.btnText}>SIGN UP</Text>
              </TouchableOpacity>

              <View style={styles.signInContainer}>
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={() => replace("/signin")}>
                  <Text style={styles.signInText}>Sign In</Text>
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
    width: 150,
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

  text: {
    color: "#ff5330",
  },

  input: {
    borderBottomWidth: 1,
    marginBottom: 28, // Adjusted to make space for error message
    fontSize: 20,
    borderColor: "#949494",
    paddingTop: 10,
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

  signInContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signUpBtn: {
    backgroundColor: "#ff5330",
    borderRadius: 20,
    marginTop: 30,
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
