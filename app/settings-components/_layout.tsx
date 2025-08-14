import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="location-services"
        options={{
          headerShown: true,
          title: "Location Services",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="alert-trigger-method"
        options={{
          headerShown: true,
          title: "Alert trigger Method",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="countdown-timer"
        options={{
          headerShown: true,
          title: "Countdown Timer",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="enable-preferences"
        options={{
          headerShown: true,
          title: "Enable Preferences",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="faqs"
        options={{
          headerShown: true,
          title: "FAQs",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="contact-us"
        options={{
          headerShown: true,
          title: "Contact Us",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="privacy-policy"
        options={{
          headerShown: true,
          title: "Privacy Policy",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="terms-conditions"
        options={{
          headerShown: true,
          title: "Terms & Conditions",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="app-tutorials"
        options={{
          headerShown: true,
          title: "App Tutorials",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="sos-msg-customization"
        options={{
          headerShown: true,
          title: "Sos Message Customization",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="addSettingsHere"
        options={{
          headerShown: true,
          title: "add Settings Here",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="license"
        options={{
          headerShown: true,
          title: "License",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="developer-info"
        options={{
          headerShown: true,
          title: "Developer Info",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />

      <Stack.Screen
        name="version"
        options={{
          headerShown: true,
          title: "Version",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "Back",
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
              name="chevron-back"
              size={24}
              color="#ff5330"
            />
          ),
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
