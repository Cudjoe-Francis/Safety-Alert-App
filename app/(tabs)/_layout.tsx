import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { replace } from "expo-router/build/global-state/routing";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { useTheme } from "..//../themeContext";

const TabsLayout = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ff5330",
          tabBarInactiveTintColor: isDarkMode ? "#fff" : "#000",
          tabBarShowLabel: true,
          headerShown: false,
          tabBarStyle: {
            paddingTop: 5,
            borderWidth: 1,
            borderTopColor: isDarkMode ? "#363636" : "#ddd",
            borderBottomColor: isDarkMode ? "#000" : "#fff",
            borderRightColor: isDarkMode ? "#000" : "#fff",
            borderLeftColor: isDarkMode ? "#000" : "#fff",
            backgroundColor: isDarkMode ? "#121212" : "#fff",
          },
        }}
        initialRouteName="index"
      >
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            // headerShown: true,
            tabBarIcon: ({ color }) => (
              <Entypo name="menu" size={26} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            // headerShown: true,
            tabBarIcon: ({ color }) => (
              <Entypo name="home" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: true,
            headerStyle: {
              backgroundColor: isDarkMode? "#121212" : "#fff",
            },
            headerTintColor: isDarkMode ? "#fff" : "#000",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="settings" size={24} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => replace("/(auth)/signin")}
                style={{ paddingRight: 18, borderRadius: 10, padding: 6 }}
              >
                <Text
                  style={{ fontSize: 16, color: "#ff5330", fontWeight: "bold" }}
                >
                  Log out
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
