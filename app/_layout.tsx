import * as Notifications from "expo-notifications";
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "../themeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { requestNotificationPermissions } from "../utils/notificationConfig";

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Initialize enhanced notification system
    const initializeNotifications = async () => {
      try {
        const granted = await requestNotificationPermissions();
        if (granted) {
          console.log('✅ Enhanced notification system initialized');
        } else {
          console.log('❌ Notification permissions denied');
          // Fallback to basic permissions
          await Notifications.requestPermissionsAsync();
        }
      } catch (error) {
        console.error('❌ Error initializing notifications:', error);
        // Fallback to basic permissions
        await Notifications.requestPermissionsAsync();
      }
    };
    
    initializeNotifications();
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
