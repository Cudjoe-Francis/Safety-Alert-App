import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup"  />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
};

export default AuthLayout;
