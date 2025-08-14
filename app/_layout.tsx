import * as Notifications from "expo-notifications";
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "../themeContext";
import { NotificationProvider } from "./context/NotificationContext";

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 1000);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Stack
              initialRouteName="(auth)"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </NotificationProvider>
        </ThemeProvider>
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}
