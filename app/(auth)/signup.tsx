import {
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
    // color: '#FF5330',
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
    marginBottom: -30,
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

  signInContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signUpBtn: {
    // backgroundColor: "#FF5330",
    backgroundColor: "red",
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
    // color: "#FF5330",
    color: "red",
  },
});
