import { Stack } from "expo-router";
import { ThemeProvider } from "../themeContext";
import { NotificationProvider } from "./context/NotificationContext"; // Add this import

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        {/* <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}> */}
        <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          {/* <Stack.Screen name="components/alone" /> */}
        </Stack>
      </NotificationProvider>
    </ThemeProvider>
  );
}
