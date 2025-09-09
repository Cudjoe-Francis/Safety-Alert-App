import * as Notifications from "expo-notifications";
import * as SplashScreen from 'expo-splash-screen';
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "../themeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { requestNotificationPermissions } from "../utils/notificationConfig";
import * as Linking from 'expo-linking';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const router = useRouter();

  useEffect(() => {
    // Initialize enhanced notification system
    const initializeNotifications = async () => {
      try {
        console.log('🔔 Initializing notification system...');
        
        // First request permissions
        const granted = await requestNotificationPermissions();
        if (granted) {
          console.log('✅ Enhanced notification system initialized');
        } else {
          console.log('❌ Notification permissions denied');
          // Fallback to basic permissions
          await Notifications.requestPermissionsAsync();
        }
        
        // Test notification to verify system is working
        console.log('🧪 Testing notification system...');
        setTimeout(async () => {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '🔔 Safety Alert System Ready',
              body: 'Push notifications are now active and working properly',
              data: { test: true },
            },
            trigger: null, // Send immediately
          });
        }, 2000);
        
      } catch (error) {
        console.error('❌ Error initializing notifications:', error);
        // Fallback to basic permissions
        await Notifications.requestPermissionsAsync();
      }
    };
    
    initializeNotifications();
  }, []);

  useEffect(() => {
    // Handle deep links when app is opened from notification
    const handleDeepLink = (url: string) => {
      console.log('🔗 Deep link received:', url);
      if (url.includes('safetyalertapp://notifications')) {
        console.log('📱 Navigating to notifications page');
        router.push('/(menu-components)/notifications');
      }
    };

    // Handle initial URL if app was opened from notification
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle URL changes while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, [router]);

  useEffect(() => {
    // Handle notification responses (when user taps notification)
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('📱 Notification action received:', response.actionIdentifier, response.notification.request.content.data);
      
      const data = response.notification.request.content.data;
      if (data?.deepLink && typeof data.deepLink === 'string') {
        console.log('🔗 Opening app with deep link:', data.deepLink);
        if (data.deepLink.includes('notifications')) {
          router.push('/(menu-components)/notifications');
        }
      } else {
        // Default behavior - navigate to notifications
        router.push('/(menu-components)/notifications');
      }
    });

    return () => subscription.remove();
  }, [router]);

  useEffect(() => {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    console.log('🔧 Setting up additional notification handlers in _layout.tsx');
    
    // Also handle notifications received while app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Foreground notification received in _layout:', notification);
      console.log('📱 Notification content:', notification.request.content);
    });

    return () => {
      foregroundSubscription.remove();
    };
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
          <Stack
            initialRouteName="(auth)"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ThemeProvider>
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}
