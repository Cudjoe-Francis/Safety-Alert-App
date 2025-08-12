import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "../themeContext";
import { NotificationProvider } from "./context/NotificationContext";

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationProvider>
        <ThemeProvider>
          <NotificationProvider>
            {/* <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}> */}
            <Stack
              initialRouteName="(tabs)"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              {/* <Stack.Screen name="components/alone" /> */}
            </Stack>
          </NotificationProvider>
        </ThemeProvider>
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}
