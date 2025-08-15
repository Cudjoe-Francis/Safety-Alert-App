import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "..//..//themeContext";
import { NotificationProvider } from "../context/NotificationContext";

const TabsLayout = () => {
  const { isDarkMode } = useTheme();

  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      setShowLogoutModal(false);
      router.replace("/(auth)/signin");
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
              backgroundColor: isDarkMode ? "#000" : "#f6f7fb",
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
              headerTintColor: "#000",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="settings" size={24} color={color} />
              ),
              headerRight: () => (
                <>
                  <TouchableOpacity
                    onPress={() => setShowLogoutModal(true)}
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
                  {/* --- Confirmation Modal --- */}
                  <Modal
                    visible={showLogoutModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowLogoutModal(false)}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#fff",
                          padding: 24,
                          borderRadius: 12,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 12,
                          }}
                        >
                          Confirm Logout
                        </Text>
                        <Text style={{ fontSize: 16, marginBottom: 24 }}>
                          Are you sure you want to log out?
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              paddingVertical: 12,
                              borderRadius: 10,
                              alignItems: "center",
                              marginHorizontal: 5,
                              backgroundColor: "#6c757d",
                            }}
                            onPress={() => setShowLogoutModal(false)}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: "bold",
                              }}
                            >
                              No
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              paddingVertical: 12,
                              borderRadius: 10,
                              alignItems: "center",
                              marginHorizontal: 5,
                              backgroundColor: "#ff5330",
                            }}
                            onPress={handleLogout}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: "bold",
                              }}
                            >
                              Yes
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </>
              ),
            }}
          />
        </Tabs>
      </>
    </NotificationProvider>
  );
};

export default TabsLayout;










































