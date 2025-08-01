import {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../themeContext";

import React, { useCallback } from "react";

const Menu = () => {
  const { theme, isDarkMode } = useTheme();
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
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? theme.background : theme.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={{ paddingVertical: 20 }}
        style={{ backgroundColor: theme.background }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.menuContainer}>
          {/* Emergency Contacts */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card }]}
            onPress={() => router.push("/(menu-components)/emergency-contacts")}
          >
            <AntDesign name="contacts" size={24} color="#ff5330" />
            <Text style={[styles.cardText, { color: theme.text }]}>
              Emergency Contacts
            </Text>
          </TouchableOpacity>

          {/* History */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card }]}
            onPress={() => router.push("/(menu-components)/history")}
          >
            <MaterialIcons name="history" size={24} color="#ff5330" />
            <Text style={[styles.cardText, { color: theme.text }]}>
              History
            </Text>
          </TouchableOpacity>

          {/* Incident Reports */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card }]}
            onPress={() => router.push("/(menu-components)/incident-reports")}
          >
            <FontAwesome5 name="file-alt" size={22} color="#ff5330" />
            <Text style={[styles.cardText, { color: theme.text }]}>
              Incident Reports
            </Text>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card }]}
            onPress={() => router.push("/(menu-components)/notifications")}
          >
            <Ionicons name="notifications-outline" size={24} color="#ff5330" />
            <Text style={[styles.cardText, { color: theme.text }]}>
              Notifications
            </Text>
          </TouchableOpacity>

          {/* Location tracker */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card }]}
            onPress={() => router.push("/(menu-components)/location-tracker")}
          >
            <Ionicons name="notifications-outline" size={24} color="#ff5330" />
            <Text style={[styles.cardText, { color: theme.text }]}>
              Location Tracker
            </Text>
          </TouchableOpacity>

          {/* Safety Tips */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card }]}
            onPress={() => router.push("/(menu-components)/safety-tips")}
          >
            <AntDesign name="Safety" size={24} color="#ff5330" />
            <Text style={[styles.cardText, { color: theme.text }]}>
              Safety Tips
            </Text>
          </TouchableOpacity>
        </View>

        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </ScrollView>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  menuContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    gap: 15,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#000",
    elevation: 2,
    gap: 16,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
