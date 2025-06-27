import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { push } from "expo-router/build/global-state/routing";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import UserDetailsModal from "../components/user-details";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";

// delete this import when done with the emergency button
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenModal = () => {
    setShowPopup(false);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer}>
        <Pressable onPress={() => setShowPopup(false)} style={{ flex: 1 }}>
          {/* Top view */}
          <View style={styles.topContainer}>
            {/* see profile and find help */}
            <View style={styles.profile_location_help_ctn}>
              {/* see profile */}
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  columnGap: 6,
                }}
              >
                {/* profile icon here */}

                <FontAwesome5 name="user-circle" size={28} color="#ff5330" />

                <View style={{ alignItems: "center" }}>
                  <Text style={styles.profile_name}>Hello Deep</Text>
                  <TouchableOpacity onPress={handleOpenModal}>
                    <Text style={styles.see_profile}>See Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Modal Screen */}
              <Modal
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
                animationType="slide"
                presentationStyle="pageSheet"
              >
                <UserDetailsModal closeModal={() => setIsModalVisible(false)} />
              </Modal>

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
                        color="#ff4330"
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
              <Text style={styles.emergency_help_text}>
                Emergency help needed?
              </Text>

              <Text style={styles.just_press_btn_text}>
                Just press the button
              </Text>
            </View>
          </View>

          {/* Middle button view */}
          <View style={styles.middleContainer}>
            {/* Middle emergency button here - change the text to btn */}
            <TouchableOpacity
              style={styles.emergency_btn}
              // onPress={() => alert("Emergency button pressed!")}
            >
              <FontAwesome name="dot-circle-o" size={220} color="#ff5330" />
            </TouchableOpacity>
          </View>

          {/* Bottom button  view */}
          <View style={styles.bottomContainer}>
            <Text style={styles.unsafe_text}>Feeling Unsafe?</Text>
            <TouchableOpacity
              style={styles.alone_btn}
              onPress={() => push("/components/alone")}
            >
              <Text style={styles.alone_btn_text}>I`m Alone</Text>
            </TouchableOpacity>
          </View>
        </Pressable>

        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
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

  mainContainer: {
    flex: 1,
  },

  topContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },

  profile_location_help_ctn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  profile_name: {
    color: "#636363",
    fontSize: 16,
    fontWeight: "500",
  },

  see_profile: {
    color: "#ff5330",
    fontSize: 16,
    fontWeight: "500",
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
    paddingBottom: 50,
  },

  unsafe_text: {
    fontSize: 18,
    fontWeight: "700",
  },

  alone_btn: {
    paddingVertical: 14,
    paddingHorizontal: 42,
    backgroundColor: "#ff5330",
    borderRadius: 12,
    marginTop: 12,
  },

  alone_btn_text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
