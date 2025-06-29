import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { replace } from "expo-router/build/global-state/routing";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const TabsLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ff5330",
          tabBarInactiveTintColor: "#000",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            paddingTop: 7,
            // borderTopLeftRadius: 30,
            // borderTopRightRadius: 30,
            borderWidth: 1,
            borderColor: "#dbdbdb",
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

        {/* <Tabs.Screen
          name="chatbot"
          options={{
             title: 'ChatBot',
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbox-ellipses" size={24} color={color} />
            ),
          }}
        /> */}

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="settings" size={24} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => replace('/(auth)/signin')} style={{ paddingRight: 18, borderRadius: 10, padding: 6 }}>
                <Text style={{ fontSize: 16, color: '#ff5330', fontWeight: 'bold' }}>Log out</Text>
                {/* <SimpleLineIcons name="logout" size={24} color="black" /> */}
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
