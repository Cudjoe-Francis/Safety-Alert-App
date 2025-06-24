import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { replace } from "expo-router/build/global-state/routing";

const SignUp = () => {

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.createAcc}>
          <Text style={styles.createAccText}>Create Your Account</Text>
        </View>

        {/* Form container */}
        <View style={styles.formContainer}>
          <Text style={styles.text}>First Name</Text>
          <TextInput style={styles.input} />

          <Text style={styles.text}>Last Name</Text>
          <TextInput style={styles.input} />

          <Text style={styles.text}>Email</Text>
          <TextInput style={styles.input} keyboardType="email-address" />

          <Text style={styles.text}>Password</Text>
          <TextInput style={styles.input} secureTextEntry />

          <Text style={styles.text}>Confirm Password</Text>
          <TextInput style={styles.input} secureTextEntry />

          <TouchableOpacity
            style={styles.signUpBtn}
            onPress={() => replace("/(tabs)")}
          >
            <Text style={styles.btnText}>SIGN UP</Text>
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => replace("/signin")}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#ff4330",
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

  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginBottom: -50,
  },

  text: {
    color: "#ff4330",
  },

  input: {
    borderBottomWidth: 1,
    marginBottom: 28,
    fontSize: 20,
    borderColor: "#949494",
    paddingTop: 10,
  },

  signInContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signUpBtn: {
    backgroundColor: "#ff4330",
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
    color: "#ff4330",
  },
});
