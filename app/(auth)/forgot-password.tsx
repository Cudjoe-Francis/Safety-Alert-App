import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleResetPassword = async () => {
    if (!validateEmail(email)) return;

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success",
        "Password reset email sent! Please check your inbox."
      );
      router.back();
    } catch (error: any) {
      console.error("Password Reset Error:", error.code, error.message);
      switch (error.code) {
        case "auth/invalid-email":
          setEmailError("That email address is invalid!");
          break;
        case "auth/user-not-found":
          setEmailError("No user found with this email.");
          break;
        default:
          setEmailError("Something went wrong. Please try again.");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Reset Password</Text>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.formContainer}>
            <Text style={styles.infoText}>
              Enter your email address and we`ll send you a link to reset your
              password.
            </Text>

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

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>SEND RESET LINK</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backCtn} onPress={() => router.back()}>
              <Text style={styles.backText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <StatusBar style="light" />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#ff5330",
    flex: 1,
  },
  header: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  text: {
    color: "#000",
  },

  input: {
    borderBottomWidth: 1,
    marginBottom: 28,
    fontSize: 20,
    borderColor: "#949494",
    paddingVertical: Platform.OS === "ios" ? 6 : 4,
  },
  
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -20,
    marginBottom: 10,
  },
  resetBtn: {
    backgroundColor: "#ff5330",
    borderRadius: 20,
    marginTop: 40,
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

    backCtn: {
        alignSelf: "center",
    },

  backText: {
    textAlign: "center",
    color: "#ff5330",
    marginTop: 10,
  },
});
