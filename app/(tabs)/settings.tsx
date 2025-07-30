import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useCallback } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { router, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../themeContext";
import { useFocusEffect } from "@react-navigation/native";

const Settings = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const navigation = useNavigation();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode
          ? offsetY > 23
            ? "#121212"
            : "#000"
          : "#fff",
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: isDarkMode ? "#000" : "#fff",
        },
      });
    }, [isDarkMode, navigation])
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 25 }}
      style={{ backgroundColor: theme.background }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          onPress={() => router.push("/settings-components/location-services")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={[styles.single_settings, { color: theme.text }]}>
              Location Services
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push("/settings-components/alert-trigger-method")
          }
        >
          <View style={styles.single_settings_ctn}>
            <Text style={[styles.single_settings, { color: theme.text }]}>
              Alert Trigger Method
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/countdown-timer")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={[styles.single_settings, { color: theme.text }]}>
              Countdown Timer
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <View style={[styles.single_settings_ctn, styles.dark_mode_ctn]}>
          <Text style={[styles.single_settings, { color: theme.text }]}>
            Dark Theme
          </Text>
          <Switch
            style={styles.switch}
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ true: "#ff5330", false: "#ccc" }}
            thumbColor="#fff"
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
            <Text style={[styles.single_settings, { color: theme.text }]}>
              Enable Preferences
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          onPress={() => router.push("/settings-components/faqs")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={[styles.single_settings, { color: theme.text }]}>
              FAQs
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/contact-us")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={[styles.single_settings, { color: theme.text }]}>
              Contact Us
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          onPress={() => router.push("/settings-components/privacy-policy")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={[styles.single_settings, { color: theme.text }]}>
              Privacy Policy
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/terms-conditions")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={[styles.single_settings, { color: theme.text }]}>
              Terms & Conditions
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/license")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={[styles.single_settings, { color: theme.text }]}>
              License
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/developer-info")}
        >
          <View style={styles.single_settings_ctn}>
            <Text style={[styles.single_settings, { color: theme.text }]}>
              Developer Info
            </Text>
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
            <Text style={[styles.single_settings, { color: theme.text }]}>
              Version
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>
      </View>

      <StatusBar style={isDarkMode ? "light" : "dark"} />
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
    paddingVertical: 14,
    paddingHorizontal: 10,
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
});
