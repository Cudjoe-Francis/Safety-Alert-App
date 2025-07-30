import { Stack } from "expo-router";
import { ThemeProvider } from "../themeContext" // update the path


export default function RootLayout() {
  return (
        <ThemeProvider>

    <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="components/alone" />
    </Stack>
        </ThemeProvider>

  );
}
