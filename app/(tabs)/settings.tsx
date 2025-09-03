import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const HEADER_HEIGHT = 42;
const SEARCH_BAR_HEIGHT = 32;
const TOP_MARGIN = 50;

const settingsOptions = [
  {
    label: "Location Services",
    icon: <Ionicons name="location-sharp" size={18} color="#fff" />,
    route: "/settings-components/location-services",
    section: "General",
  },
  {
    label: "Alert Trigger Method",
    icon: <MaterialCommunityIcons name="bell-alert" size={18} color="#fff" />,
    route: "/settings-components/alert-trigger-method",
    section: "General",
  },
  {
    label: "Countdown Timer",
    icon: (
      <MaterialCommunityIcons name="timer-outline" size={18} color="#fff" />
    ),
    route: "/settings-components/countdown-timer",
    section: "General",
  },
  {
    label: "Enable Preferences",
    icon: <MaterialCommunityIcons name="tune" size={18} color="#fff" />,
    route: "/settings-components/enable-preferences",
    section: "General",
  },
  {
    label: "FAQs",
    icon: (
      <MaterialCommunityIcons
        name="help-circle-outline"
        size={18}
        color="#fff"
      />
    ),
    route: "/settings-components/faqs",
    section: "Support",
  },
  {
    label: "Contact Us",
    icon: (
      <MaterialCommunityIcons name="email-outline" size={18} color="#fff" />
    ),
    route: "/settings-components/contact-us",
    section: "Support",
  },
  {
    label: "Privacy Policy",
    icon: <FontAwesome5 name="user-shield" size={18} color="#fff" />,
    route: "/settings-components/privacy-policy",
    section: "Legal & Info",
  },
  {
    label: "Terms & Conditions",
    icon: (
      <MaterialCommunityIcons
        name="file-document-outline"
        size={18}
        color="#fff"
      />
    ),
    route: "/settings-components/terms-conditions",
    section: "Legal & Info",
  },
  {
    label: "App Tutorials",
    icon: (
      <MaterialCommunityIcons name="book-open-outline" size={18} color="#fff" />
    ),
    route: "/settings-components/app-tutorials",
    section: "Legal & Info",
  },
  {
    label: "SOS Message Customization",
    icon: (
      <MaterialCommunityIcons
        name="message-alert-outline"
        size={18}
        color="#fff"
      />
    ),
    route: "/settings-components/sos-msg-customization",
    section: "Legal & Info",
  },
  {
    label: "License",
    icon: (
      <MaterialCommunityIcons
        name="certificate-outline"
        size={18}
        color="#fff"
      />
    ),
    route: "/settings-components/license",
    section: "Legal & Info",
  },
  {
    label: "Developer Info",
    icon: (
      <MaterialCommunityIcons
        name="account-circle-outline"
        size={18}
        color="#fff"
      />
    ),
    route: "/settings-components/developer-info",
    section: "Legal & Info",
  },
  {
    label: "Version",
    icon: (
      <MaterialCommunityIcons
        name="information-outline"
        size={18}
        color="#fff"
      />
    ),
    route: "/settings-components/version",
    section: "Legal & Info",
  },
];

const sectionColors = {
  General: "#4caf50",
  Support: "#607d8b",
  "Legal & Info": "#795548",
};

const Settings = () => {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [search, setSearch] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerStyle: {
          // backgroundColor: "#f6f7fb",
          backgroundColor: "rgba(246, 247, 251, 1)", // 0.7 = 70% opacity
          borderBottomWidth: 0,
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 22,
          color: "#222",
        },
        headerTitle: "Settings",
      });
    }, [navigation])
  );

  // Show search bar only when overscrolled at top
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY < -60 && !showSearchBar) {
          setShowSearchBar(true);
        }
        if (offsetY > 0 && showSearchBar) {
          setShowSearchBar(false);
          Keyboard.dismiss();
        }
      },
    }
  );

  // Search suggestions logic
  React.useEffect(() => {
    if (search.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const lower = search.toLowerCase();
    setSuggestions(
      settingsOptions.filter((opt) => opt.label.toLowerCase().includes(lower))
    );
  }, [search]);

  // Helper for icon backgrounds
  const iconBg = (color: string): ViewStyle => ({
    backgroundColor: color,
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    shadowColor: color,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  });

  // Cards grouped by section
  const grouped = settingsOptions.reduce((acc, curr) => {
    acc[curr.section] = acc[curr.section] || [];
    acc[curr.section].push(curr);
    return acc;
  }, {} as Record<string, typeof settingsOptions>);

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f7fb" }}>
      {/* Search Bar */}
      {showSearchBar && (
        <Animated.View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color="#bbb"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search settings..."
              placeholderTextColor="#bbb"
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
          </View>
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionRow}
                    onPress={() => {
                      setSearch("");
                      setShowSearchBar(false);
                      router.push(item.route);
                    }}
                  >
                    <View
                      style={iconBg(sectionColors[item.section] || "#ff5330")}
                    >
                      {item.icon}
                    </View>
                    <Text style={styles.suggestionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </Animated.View>
      )}

      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 25 }}
        style={{ backgroundColor: "#f6f7fb" }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {/* Spacer for header */}
        <View style={{ height: HEADER_HEIGHT }} />
        {/* Spacer for margin between header and General card */}
        <View
          style={{
            height: showSearchBar ? SEARCH_BAR_HEIGHT + TOP_MARGIN : TOP_MARGIN,
          }}
        />
        {/* General Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>General</Text>
        </View>
        <View style={styles.card}>
          {/* Location Services */}
          <TouchableOpacity
            onPress={() =>
              router.push("/settings-components/location-services")
            }
          >
            <View style={styles.row}>
              <View style={iconBg("#4caf50")}>
                <Ionicons name="location-sharp" size={18} color="#fff" />
              </View>
              <Text style={styles.rowText}>Location Services</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity>
          {/* Alert Trigger Method */}

          {/* <TouchableOpacity
            onPress={() =>
              router.push("/settings-components/alert-trigger-method")
            }
          >
            <View style={styles.row}>
              <View style={iconBg("#ff9800")}>
                <MaterialCommunityIcons
                  name="bell-alert"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.rowText}>Alert Trigger Method</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity> */}

          {/* Countdown Timer */}
          <TouchableOpacity
            onPress={() => router.push("/settings-components/countdown-timer")}
          >
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <View style={iconBg("#2196f3")}>
                <MaterialCommunityIcons
                  name="timer-outline"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.rowText}>Countdown Timer</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity>

          {/* Dark Theme */}
          {/* <View style={styles.row}>
            <View style={iconBg("#222")}>
              <Ionicons name="moon" size={20} color="#fff" />
            </View>
            <Text style={styles.rowText}>Dark Theme</Text>
            <Switch
              style={styles.switch}
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ true: "#ff5330", false: "#ccc" }}
              thumbColor={isDarkMode ? "#fff" : "#ff5330"}
            />
          </View> */}

          {/* Enable Preferences */}
          {/* <TouchableOpacity
            onPress={() =>
              router.push("/settings-components/enable-preferences")
            }
          >
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <View style={iconBg("#9c27b0")}>
                <MaterialCommunityIcons name="tune" size={18} color="#fff" />
              </View>
              <Text style={styles.rowText}>Enable Preferences</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity> */}

        </View>
        {/* Support Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Support</Text>
        </View>
        <View style={styles.card}>
          {/* FAQs */}
          <TouchableOpacity
            onPress={() => router.push("/settings-components/faqs")}
          >
            <View style={styles.row}>
              <View style={iconBg("#607d8b")}>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.rowText}>FAQs</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity>
          {/* Contact Us */}
          <TouchableOpacity
            onPress={() => router.push("/settings-components/contact-us")}
          >
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <View style={iconBg("#009688")}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.rowText}>Contact Us</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity>
        </View>
        {/* Legal & Info Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Legal & Info</Text>
        </View>
        <View style={styles.card}>
          {/* Privacy Policy */}
          <TouchableOpacity
            onPress={() => router.push("/settings-components/privacy-policy")}
          >
            <View style={styles.row}>
              <View style={iconBg("#3f51b5")}>
                <FontAwesome5 name="user-shield" size={18} color="#fff" />
              </View>
              <Text style={styles.rowText}>Privacy Policy</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity>
          {/* Terms & Conditions */}
          <TouchableOpacity
            onPress={() => router.push("/settings-components/terms-conditions")}
          >
            <View style={styles.row}>
              <View style={iconBg("#795548")}>
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.rowText}>Terms & Conditions</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity>
          {/* App Tutorials */}
          <TouchableOpacity
            onPress={() => router.push("/settings-components/app-tutorials")}
          >
            <View style={styles.row}>
              <View style={iconBg("#795548")}>
                <MaterialCommunityIcons
                  name="book-open-outline"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.rowText}>App Tutorials</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity>

          {/* SOS Message Customization */}
          {/* <TouchableOpacity
            onPress={() =>
              router.push("/settings-components/sos-msg-customization")
            }
          >
            <View style={styles.row}>
              <View style={iconBg("#ff5330")}>
                <MaterialCommunityIcons
                  name="message-alert-outline"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.rowText}>SOS Message Customization</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity> */}

          {/* License */}
          <TouchableOpacity
            onPress={() => router.push("/settings-components/license")}
          >
            <View style={styles.row}>
              <View style={iconBg("#607d8b")}>
                <MaterialCommunityIcons
                  name="certificate-outline"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.rowText}>Licenses & Legal</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity>
          {/* Developer Info */}
          <TouchableOpacity
            onPress={() => router.push("/settings-components/developer-info")}
          >
            <View style={styles.row}>
              <View style={iconBg("#607d8b")}>
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.rowText}>Developer Info</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity>
          {/* Version */}
          <TouchableOpacity
            onPress={() => router.push("/settings-components/version")}
          >
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <View style={iconBg("#607d8b")}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.rowText}>Version</Text>
              <Entypo name="chevron-small-right" size={24} color="#bbb" />
            </View>
          </TouchableOpacity>
        </View>
        <StatusBar style="dark" />
      </Animated.ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  searchBarContainer: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 20,
    right: 20,
    zIndex: 9,

    backgroundColor: "#f6f7fb",

    width: 350,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    // backgroundColor: "blue",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    shadowColor: "#ff5330",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    width: "100%",
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    width: "100%",
  },
  suggestionsContainer: {
    // backgroundColor: "#fff",///////////////////////////////////
    backgroundColor: "#d6cacaff", ////////////////////////////////////////
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#ff5330",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    maxHeight: 220,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
    color: "#222",
    marginLeft: 10,
    fontWeight: "500",
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 8,
    marginLeft: 24,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff5330",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 18,
    elevation: 4,
    shadowColor: "#ff5330",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  rowText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#222",
    flex: 1,
    letterSpacing: 0.2,
  },
  switch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
    marginHorizontal: 2,
  },
});
