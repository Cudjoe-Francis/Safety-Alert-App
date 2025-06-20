import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false}}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="components/alone" options={{ headerShown: false }} />
      <Stack.Screen name="components/record-audio" options={{ headerShown: false }} />
      <Stack.Screen name="components/emergency-contacts" options={{ headerShown: true }} />
    </Stack>
  );
}
