import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
} from "react-native";
import { auth } from "../../firebaseConfig";

import { getDatabase, off, onValue, ref } from "firebase/database";

const SignInScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string>("there");
  const [userDetails, setUserDetails] = useState<any>(null);

  // Check if biometric is supported
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricSupported(compatible && enrolled);
    })();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const listener = onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserDetails(data);
          setCurrentUserName(data?.firstName || "there");
        });
        return () => off(userRef, "value", listener);
      } else {
        setCurrentUserName("there");
        setUserDetails(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

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

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required.");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignIn = async () => {
    setAuthError("");
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in successfully!");
        router.replace("/(tabs)");
      } catch (error: any) {
        console.error("Sign In Error:", error.code, error.message);
        switch (error.code) {
          case "auth/invalid-email":
            setAuthError("That email address is invalid!");
            break;
          case "auth/user-disabled":
            setAuthError("This user has been disabled.");
            break;
          case "auth/user-not-found":
            setAuthError("No user found with this email.");
            break;
          case "auth/wrong-password":
            setAuthError("Incorrect password.");
            break;
          case "auth/invalid-credential":
            setAuthError("Invalid login credentials. Please try again.");
            break;
          default:
            setAuthError("Sign in failed. Please check your credentials.");
            break;
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Validation failed.");
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return Alert.alert(
          "Biometric Auth",
          "Biometric authentication not supported or set up on this device."
        );
      }

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate",
        fallbackLabel: "Use Password",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (authResult.success) {
        Alert.alert("Success", "Authenticated ✅");
        router.replace("/(tabs)");
      } else {
        Alert.alert("Failed", "Authentication failed ❌");
      }
    } catch (error) {
      console.error("Biometric Auth Error", error);
      Alert.alert("Error", "An error occurred while authenticating.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.mainContainer}>
        <View style={styles.createAcc}>
          <Text style={styles.createAccText}>Hello Sign In!</Text>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome Back</Text>

              <Text style={styles.text}>Email</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                  setAuthError("");
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
                  setAuthError("");
                }}
                onBlur={() => validatePassword(password)}
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}

              {authError ? (
                <Text style={styles.errorText}>{authError}</Text>
              ) : null}

              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signUpBtn}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>SIGN IN</Text>
                )}
              </TouchableOpacity>

              {/* {biometricSupported && (
                <TouchableOpacity
                  onPress={handleBiometricAuth}
                  style={styles.biometricBtn}
                >
                  <Text style={styles.btnText}>🔒 Biometric Login</Text>
                </TouchableOpacity>
              )} */}

              <View style={styles.signInContainer}>
                <Text>Don`t have an account?</Text>
                <TouchableOpacity onPress={() => router.replace("/signup")}>
                  <Text style={styles.signInText}> Sign Up</Text>
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
                <Text style={{ fontSize: 40 }}>Home</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </KeyboardAvoidingView>
        <StatusBar style="light" />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#ff5330",
    flex: 1,
  },
  createAcc: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  createAccText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    width: 80,
  },
  scrollViewContent: {
    justifyContent: "space-between",
    flex: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  welcomeText: {
    fontSize: 22,
    paddingBottom: 70,
    textAlign: "center",
    fontWeight: "bold",
  },
  text: {
    color: "#000",
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 28,
    fontSize: 20,
    borderColor: "#949494",
    paddingVertical: 4,
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
  forgotPasswordText: {
    marginTop: -10,
    textAlign: "right",
    color: "#FF5330",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  signUpBtn: {
    backgroundColor: "#ff5330",
    borderRadius: 20,
    marginTop: 40,
    paddingVertical: 10,
    width: 340,
    alignSelf: "center",
    marginBottom: 20,
  },
  biometricBtn: {
    backgroundColor: "#555",
    borderRadius: 20,
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
