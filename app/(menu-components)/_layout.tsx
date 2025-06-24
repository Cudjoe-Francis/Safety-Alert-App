import { router, Stack } from "expo-router";
// import AntDesign from "@expo/vector-icons/AntDesign";

const MenuComponents = () => {
  return (
    <Stack>
      <Stack.Screen
        name="emergency-contacts"
        options={{
          title: "Emergency Contacts",
        }}
      />
      <Stack.Screen
        name="incident-reports"
        options={{
          title: "Incident Reports",
        }}
      />
      <Stack.Screen
        name="live-location-sharing"
        options={{
          title: "Live Location Sharing",
        }}
      />
      <Stack.Screen
        name="record-audio"
        options={{
          title: "Record Audio",
          // headerLeft: (() => (
          //   <AntDesign name="arrowleft" size={24} color="black" onPress={() => router.back()}/>
          // ))
        }}
      />
    </Stack>
  );
};

export default MenuComponents;
