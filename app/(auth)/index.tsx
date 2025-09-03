import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { push } from "expo-router/build/global-state/routing";
// import { router } from "expo-router";

// const googleLogo = require("..//../assets/images/google.png");
// const appleLogo = require("..//../assets/images/images.png");
// const facebookLogo = require("..//../assets/images/facebook.png");

const backgroundImage = require("..//../assets/images/Safety_Alert_App_Background.png");

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

          {/* <Text style={styles.optionText}>Signup or Login with</Text> */}

          {/* <View style={styles.optionContainer}>
            <TouchableOpacity style={styles.icon}>
              <Image source={googleLogo} style={styles.img} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.icon, {}]}>
              <Image source={appleLogo} style={styles.img} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.icon}>
              <Image source={facebookLogo} style={styles.img} />
            </TouchableOpacity>
          </View> */}
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default FlashScreen;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    // resizeMode: "contain",
  },

  container: {
    flex: 1,
  },

  topContainer: {
    flex: 0.9,
    // backgroundColor: "lightgreen",
    paddingTop: 50,
  },

  bottomContainer: {
    // flex: 0.2,
    // backgroundColor: "#ff340cff",
    // top: 50,
  },

  img: {
    width: 46,
    height: 46,
    borderRadius: 30,
  },

  welcomeText: {
    color: "#000",
    fontSize: 18,
    textAlign: "center",
    paddingTop: 10,
    fontWeight: "400",
    fontStyle: "italic",
  },

  safetyText: {
    paddingTop: 20,
    fontSize: 28,
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
    backgroundColor: "#EE3322",/////////////
    paddingVertical: 14,
  },

  signInText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  signUpContainer: {
    backgroundColor: "#EE3322",
  },

  signUpText: {
    color: "#fff",
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
