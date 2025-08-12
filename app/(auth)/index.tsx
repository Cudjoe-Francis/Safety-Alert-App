import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { push } from "expo-router/build/global-state/routing";
import { router } from "expo-router";

const googleLogo = require("..//../assets/images/google.png");
const instagramLogo = require("..//../assets/images/instagram.jpeg");
const facebookLogo = require("..//../assets/images/facebook.png");

const backgroundImage = require("..//../assets/images/flashBackground.png");

const FlashScreen = () => {
  return (
    <ImageBackground source={backgroundImage} style={styles.bgImage}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={[styles.welcomeText, styles.safetyText]}>
            Welcome To Safety Alert App
          </Text>
          <Text style={styles.welcomeText}>Your Safety Matters</Text>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => push("/signin")}
            style={styles.signInContainer}
          >
            <Text style={styles.signInText}>SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => push("/signup")}
            style={[styles.signInContainer, styles.signUpContainer]}
          >
            <Text style={[styles.signInText, styles.signUpText]}>SIGN UP</Text>
          </TouchableOpacity>

          <Text style={styles.optionText}>Signup or Login with</Text>

          <View style={styles.optionContainer}>
            <TouchableOpacity style={styles.icon}>
              <Image source={facebookLogo} style={styles.img} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.icon}>
              <Image source={instagramLogo} style={styles.img} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.icon}>
              <Image source={googleLogo} style={styles.img} />
            </TouchableOpacity>

            {/* /////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            {/* <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
              <Text style={{ fontSize: 40 }}>Home</Text>
            </TouchableOpacity> */}
            {/* /////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          </View>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default FlashScreen;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: "cover",
  },

  container: {
    flex: 1,
  },

  topContainer: {
    flex: 0.6,
  },

  bottomContainer: {
    flex: 0.42,
  },

  img: {
    width: 46,
    height: 46,
    borderRadius: 30,
  },

  welcomeText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    paddingTop: 10,
    fontWeight: "400",
    fontStyle: "italic",
  },

  safetyText: {
    paddingTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
  },

  signInContainer: {
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: 30,
    alignSelf: "center",
    width: 340,
    borderRadius: 20,
    backgroundColor: "#FF5330",
    // backgroundColor: "#ff5330",
    paddingVertical: 10,
  },

  signInText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  signUpContainer: {
    backgroundColor: "#fff",
  },

  signUpText: {
    color: "#000",
  },

  optionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "500",
    marginTop: 65,
  },

  optionContainer: {
    flexDirection: "row",
    alignSelf: "center",
    width: 300,
    justifyContent: "space-evenly",
    marginTop: 14,
  },

  icon: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 30,
  },
});
