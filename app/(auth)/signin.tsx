import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { push, replace } from "expo-router/build/global-state/routing";

const SignUp = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <Button title='Back' onPress={() => router.back()} /> */}

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
    // backgroundColor: "#FF5330",
    backgroundColor: "red",
    flex: 1,
  },

  createAcc: {
    // backgroundColor: "#FF5330",
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
    marginBottom: -30,
  },

  welcomeText: {
    fontSize: 22,
    paddingBottom: 70,
    textAlign: "center",
    fontWeight: "bold",
  },

  text: {
    // color: "#FF5330",
    color: "red",
  },

  input: {
    borderBottomWidth: 1,
    marginBottom: 24,
    fontSize: 18,
    borderColor: "grey",
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
    // backgroundColor: "#FF5330",
    backgroundColor: "red",
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
    // color: "#FF5330",
    color: "red",
  },
});
