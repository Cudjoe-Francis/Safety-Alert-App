import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// delete this import when done with the emergency button
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Alone = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer}>
        <Pressable onPress={() => setShowPopup(false)} style={{ flex: 1 }}>
          {/* Top view */}
          <View style={styles.topContainer}>
            <View style={styles.back_icon_ctn}>
              <Pressable onPress={() => router.back()} style={styles.back_icon}>
                <Entypo name="chevron-left" size={28} color="#ff5330" />
              </Pressable>

              {/* find help */}
              <View style={styles.find_help_ctn}>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => setShowPopup((prev) => !prev)}
                >
                  <View style={{ width: 70 }}>
                    <Text style={styles.find_help_text}>Find Help nearby</Text>
                  </View>
                  <Entypo name="location-pin" size={32} color="#ff5330" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Find Help Nearby Popup */}
            {showPopup && (
              <Pressable style={styles.absoluteFill}>
                <View style={styles.popupContainer}>
                  <Pressable style={styles.popup}>
                    <TouchableOpacity style={styles.option}>
                      <MaterialIcons
                        name="security"
                        size={24}
                        color="#ff5330"
                      />
                      <Text style={styles.popupText}>Police Station</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                      <FontAwesome5
                        name="hospital-alt"
                        size={20}
                        color="#ff5330"
                      />
                      <Text style={styles.popupText}>Hospitals</Text>
                    </TouchableOpacity>
                  </Pressable>
                </View>
              </Pressable>
            )}

            {/* emergency and help */}
            <View style={styles.emergency_help_ctn}>
              <Text style={styles.emergency_help_text}>Alone Mode</Text>

              <Text style={styles.just_press_btn_text}>
                After the timer starts, if you doesn`t respond (Press the button
                below) in 15 mins. The app will inform your peers that you`re in
                danger
              </Text>
            </View>
          </View>

          {/* Middle button view */}
          <View style={styles.middleContainer}>
            {/* Middle emergency button here - change the text to btn */}
            <TouchableOpacity
              style={styles.emergency_btn}
              // onPress={() => alert("Alone button pressed!")}
            >
              <FontAwesome name="dot-circle-o" size={220} color="#ff5330" />
            </TouchableOpacity>
          </View>

          {/* Bottom button  view */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.alone_btn}
              // onPress={() => alert("Stop button pressed!")}
            >
              <Text style={styles.alone_btn_text}>Start</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Alone;

const styles = StyleSheet.create({
  // popup styling
  absoluteFill: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    borderRadius: 8,
  },
  popupContainer: {
    borderRadius: 8,
  },
  popup: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  option: {
    paddingVertical: 8,
    flexDirection: "row",
    columnGap: 12,
    alignItems: "center",
    paddingRight: 14,
    paddingLeft: 6,
  },

  popupText: {
    fontSize: 17,
  },
  // popup styling ends here

  mainContainer: {
    flex: 1,
  },

  topContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },

  back_icon_ctn: {
    paddingHorizontal: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  back_icon: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    height: 40,
  },

  find_help_ctn: {
    flexDirection: "row",
    alignItems: "center",
  },

  find_help_text: {
    color: "#ff5330",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },

  emergency_help_ctn: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: 2,
  },

  emergency_help_text: {
    fontSize: 28,
    fontWeight: "bold",
    width: 200,
    textAlign: "center",
  },

  just_press_btn_text: {
    color: "#636363",
    fontSize: 15,
    textAlign: "center",
    width: 280,
  },

  middleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emergency_btn: {
    alignItems: "center",
  },

  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  alone_btn: {
    paddingVertical: 14,
    paddingHorizontal: 60,
    backgroundColor: "#ff5330",
    borderRadius: 12,
  },

  alone_btn_text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
