import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { replace } from "expo-router/build/global-state/routing";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, Text, TouchableOpacity } from "react-native";

import { useTheme } from "..//..//themeContext";
import { NotificationProvider } from "../context/NotificationContext";

const TabsLayout = () => {
  const { isDarkMode } = useTheme();

  return (
    <NotificationProvider>
      <>
        <StatusBar style="dark" />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#ff5330",
            tabBarInactiveTintColor: isDarkMode ? "#fff" : "#000",
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
              paddingTop: 5,
              marginBottom: -10,
              backgroundColor: isDarkMode ? "#000" : "#fff",
              borderTopWidth: Platform.OS === "ios" ? 0.5 : 0.5,
              borderTopColor:
                Platform.OS === "ios"
                  ? isDarkMode
                    ? "#3d3d3dff"
                    : "#eee"
                  : undefined,
              elevation: Platform.OS === "android" ? 8 : 0,
            },
          }}
          initialRouteName="index"
        >
          <Tabs.Screen
            name="menu"
            options={{
              title: "Menu",
              headerShown: true,
              headerTintColor: isDarkMode ? "#fff" : "#000",
              tabBarIcon: ({ color }) => (
                <Entypo name="menu" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              headerShown: false,
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
                    style={{
                      fontSize: 16,
                      color: "#ff5330",
                      fontWeight: "bold",
                    }}
                  >
                    Log out
                  </Text>
                </TouchableOpacity>
              ),
            }}
          />
        </Tabs>
      </>
    </NotificationProvider>
  );
};

export default TabsLayout;
