import {
  Pressable,
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

      <View style={styles.createAcc}>
        <Text style={styles.createAccText}>Hello Sign In!</Text>
      </View>

      {/* Form container */}
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Welcome Back</Text>

        <Text style={styles.text}>Email</Text>
        <TextInput style={styles.input} keyboardType="email-address" />

        <Text style={styles.text}>Password</Text>
        <TextInput style={styles.input} secureTextEntry />

        <Pressable>
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </Pressable>

        <TouchableOpacity
          style={styles.signUpBtn}
          onPress={() => replace("/(tabs)")}
        >
          <Text style={styles.btnText}>SIGN IN</Text>
        </TouchableOpacity>

        <View style={styles.signInContainer}>
          <Text>Don`t have an account?</Text>
          <TouchableOpacity onPress={() => replace("/signup")}>
            <Text style={styles.signInText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    width: 100,
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

  welcomeText: {
    fontSize: 22,
    paddingBottom: 70,
    textAlign: "center",
    fontWeight: "bold",
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

  forgotPasswordText: {
    marginTop: -10,
    textAlign: "right",
  },

  signInContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signUpBtn: {
    backgroundColor: "#ff4330",
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
    color: "#ff4330",
  },
});
