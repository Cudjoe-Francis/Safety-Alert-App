import { router, Stack } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';


const MenuComponents = () => {
  return (
    <Stack>
      <Stack.Screen
        name="emergency-contacts"
        options={{
          title: "Emergency Contacts",
          headerLeft: () => (
            <Ionicons onPress={()=> router.back()} style={{ marginRight: 16 }} name="chevron-back" size={24} color="#ff5330" />
          )
        }}
      />

      <Stack.Screen
        name="incident-reports"
        options={{
          title: "Incident Reports",
          headerShown: false
        }}
      />

      <Stack.Screen
        name="live-location-sharing"
        options={{
          title: "Live Location Sharing",
          headerLeft: () => (
            <Ionicons onPress={()=> router.back()}  style={{ marginRight: 16 }} name="chevron-back" size={24} color="#ff5330" />
          )
        }}
      />

      <Stack.Screen
        name="history"
        options={{
          title: "History",
          headerLeft: () => (
            <Ionicons onPress={()=> router.back()}  style={{ marginRight: 16 }} name="chevron-back" size={24} color="#ff5330" />
          )
        }}
      />

      <Stack.Screen
        name="notifications"
        options={{ 
          // title: "Select Security Agencies", 
          headerShown: false
         }}
      />

    </Stack>
  );
};

export default MenuComponents;
