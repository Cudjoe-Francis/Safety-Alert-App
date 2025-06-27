import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
      {/* General settings */}
      {/* <Text style={styles.heading}>General</Text> */}

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push("/settings-components/location-services")}
        >
          <View style={styles.single_settings_ctn}>
            {/* <Entypo name="location-pin" size={24} color="black" /> */}
            <Text style={styles.single_settings}>Location Services</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push("/settings-components/alert-trigger-method")
          }
        >
          <View style={styles.single_settings_ctn}>
            <Text style={styles.single_settings}>Alert Trigger Method</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/countdown-timer")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={styles.single_settings}>Countdown Timer</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <View style={[styles.single_settings_ctn, styles.dark_mode_ctn]}>
          <Text style={styles.single_settings}>Dark Theme</Text>
          <Switch
            style={styles.switch}
            value={isDarkMode}
            onValueChange={(prev) => setIsDarkMode((prev) => !prev)}
            trackColor={{true: '#ff5330', false: 'ccc'}}
            thumbColor='#fff'
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/enable-preferences")}
        >
          <View
            style={[
              styles.single_settings_ctn,
              styles.last_single_settings_ctn,
            ]}
          >
            <Text style={styles.single_settings}>Enable Preferences</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>


        <TouchableOpacity
          onPress={() => router.push("/settings-components/faqs")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={styles.single_settings}>FAQs</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/contact-us")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={styles.single_settings}>Contact Us</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>
      </View>


      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push("/settings-components/privacy-policy")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={styles.single_settings}>Privacy Policy</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/terms-conditions")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={styles.single_settings}>Terms & Conditions</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/license")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={styles.single_settings}>License</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/developer-info")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={styles.single_settings}>Developer Info</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/version")}
        >
          <View
            style={[
              styles.single_settings_ctn,
              styles.last_single_settings_ctn,
            ]}
          >
            <Text style={styles.single_settings}>Version</Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>
      </View>

      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  heading: {
    paddingLeft: 20,
    paddingVertical: 20,
    fontSize: 18,
    fontWeight: "500",
  },

  container: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 24,
  },

  single_settings_ctn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    // borderBottomWidth: 1,////////////////
    // borderColor: "#eee",//////////////
  },

  dark_mode_ctn: {
    paddingVertical: 3,
  },

  last_single_settings_ctn: {
    borderBottomWidth: 0,
  },

  single_settings: {
    fontSize: 16,
  },

  switch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
    padding: 0,
    margin: 0,
  },

  logoutButton: {
    backgroundColor: "#ff5330",
    marginTop: 30,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
