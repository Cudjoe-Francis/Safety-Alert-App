import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Foundation from "@expo/vector-icons/Foundation";
import Entypo from "@expo/vector-icons/Entypo";
import { StatusBar } from "expo-status-bar";
import { push } from "expo-router/build/global-state/routing";

const Contacts = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Hello there</Text>
        <Text style={styles.heading}>How can we help you today?</Text>
      </View>

      <ScrollView style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => push("/(menu-components)/emergency-contacts")}
        >
          <View style={styles.ctn}>
            <MaterialIcons name="contact-emergency" size={24} color="red" />
            <Text style={styles.text}>Emergency contacts</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => push("/(menu-components)/record-audio")}
        >
          <View style={styles.ctn}>
            <Foundation name="record" size={25} color="red" />
            <Text style={styles.text}>Record audio</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => push("/(menu-components)/live-location-sharing")}
        >
          <View style={styles.ctn}>
            <Entypo name="location-pin" size={24} color="red" />
            <Text style={styles.text}>Live Location Sharing</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => push("/(menu-components)/incident-reports")}
        >
          <View style={styles.ctn}>
            <MaterialIcons name="report" size={24} color="red" />
            <Text style={styles.text}>Incident Report</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff4330",
  },

  headingContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#ff4330",
    paddingBottom: 20,
    justifyContent: "flex-end",
    flex: 0.2,
  },

  heading: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },

  bottomContainer: {
    backgroundColor: "#fff",
    flex: 0.8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: -40,
  },

  ctn: {
    borderWidth: 1,
    borderColor: "#ff4330",
    padding: 20,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
    marginBottom: 16,
  },

  text: {
    // fontWeight: "500",
    fontSize: 24,
  },
});
