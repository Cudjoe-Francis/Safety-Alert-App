import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../themeContext";

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

  // Helper for icon backgrounds
  const iconBg = (color: string): ViewStyle => ({
    backgroundColor: color,
    borderRadius: 8,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  });

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
          <View
            style={[
              styles.single_settings_ctn,
              { borderBottomColor: isDarkMode ? theme.border : "#eee" },
            ]}
          >
            <View style={iconBg("#4caf50")}>
              <Ionicons name="location-sharp" size={18} color="#fff" />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
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
          <View
            style={[
              styles.single_settings_ctn,
              { borderBottomColor: isDarkMode ? theme.border : "#eee" },
            ]}
          >
            <View style={iconBg("#ff9800")}>
              <MaterialCommunityIcons name="bell-alert" size={18} color="#fff" />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
              Alert Trigger Method
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/countdown-timer")}
        >
          <View
            style={[
              styles.single_settings_ctn,
              { borderBottomColor: isDarkMode ? theme.border : "#eee" },
            ]}
          >
            <View style={iconBg("#2196f3")}>
              <MaterialCommunityIcons
                name="timer-outline"
                size={18}
                color="#fff"
              />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
              Countdown Timer
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <View
          style={[
            styles.single_settings_ctn,
            styles.dark_mode_ctn,
            { borderBottomColor: isDarkMode ? theme.border : "#eee" },
          ]}
        >
          <View style={iconBg("#222")}>
            <Ionicons name="moon" size={18} color="#fff" />
          </View>
          <Text
            style={[styles.single_settings, { color: theme.text, flex: 1 }]}
          >
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
            <View style={iconBg("#9c27b0")}>
              <MaterialCommunityIcons name="tune" size={18} color="#fff" />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
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
          <View
            style={[
              styles.single_settings_ctn,
              { borderBottomColor: isDarkMode ? theme.border : "#eee" },
            ]}
          >
            <View style={iconBg("#607d8b")}>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={18}
                color="#fff"
              />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
              FAQs
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/contact-us")}
        >
          <View
            style={[
              styles.single_settings_ctn,
              {
                borderBottomColor: isDarkMode ? theme.border : "#eee",
                borderBottomWidth: 0,
              },
            ]}
          >
            <View style={iconBg("#009688")}>
              <MaterialCommunityIcons
                name="email-outline"
                size={18}
                color="#fff"
              />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
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
          <View
            style={[
              styles.single_settings_ctn,
              { borderBottomColor: isDarkMode ? theme.border : "#eee" },
            ]}
          >
            <View style={iconBg("#3f51b5")}>
              <FontAwesome5 name="user-shield" size={18} color="#fff" />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
              Privacy Policy
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/terms-conditions")}
        >
          <View
            style={[
              styles.single_settings_ctn,
              { borderBottomColor: isDarkMode ? theme.border : "#eee" },
            ]}
          >
            <View style={iconBg("#795548")}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={18}
                color="#fff"
              />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
              Terms & Conditions
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/license")}
        >
          <View
            style={[
              styles.single_settings_ctn,
              { borderBottomColor: isDarkMode ? theme.border : "#eee" },
            ]}
          >
            <View style={iconBg("#607d8b")}>
              <MaterialCommunityIcons
                name="certificate-outline"
                size={18}
                color="#fff"
              />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
              License
            </Text>
            <Entypo name="chevron-small-right" size={24} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings-components/developer-info")}
        >
          <View
            style={[
              styles.single_settings_ctn,
              { borderBottomColor: isDarkMode ? theme.border : "#eee" },
            ]}
          >
            <View style={iconBg("#607d8b")}>
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={18}
                color="#fff"
              />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
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
            <View style={iconBg("#607d8b")}>
              <MaterialCommunityIcons
                name="information-outline"
                size={18}
                color="#fff"
              />
            </View>
            <Text
              style={[styles.single_settings, { color: theme.text, flex: 1 }]}
            >
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
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  single_settings_ctn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  dark_mode_ctn: {
    paddingVertical: 7,
  },
  last_single_settings_ctn: {
    borderBottomWidth: 0,
  },
  single_settings: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    padding: 0,
    margin: 0,
  },
});
