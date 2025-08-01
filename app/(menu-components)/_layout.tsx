// work on darkmode nicely for the headers here 
import { router, Stack } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from "../../themeContext";




const MenuComponents = () => {

    const { isDarkMode } = useTheme();
  
    
  return (
    <Stack>
      <Stack.Screen
        name="emergency-contacts"
        options={{
          title: "Emergency Contacts",
          headerTintColor: isDarkMode ? "#fff" : "#000",
          headerShown: true,
          headerLeft: () => (
            <Ionicons onPress={()=> router.back()} style={{ marginRight: 16 }} name="chevron-back" size={24} color="#ff5330" />
          )
        }}
      />

      <Stack.Screen
        name="incident-reports"
        options={{
          title: "Incident Reports",
          headerShown: true,
          headerTintColor: isDarkMode ? "#fff" : "#000",
          headerLeft: () => (<Ionicons onPress={()=> router.back()} style={{ marginRight: 16 }} name="chevron-back" size={24} color="#ff5330" />
          )
        }}
      />

      <Stack.Screen
        name="location-tracker"
        options={{
          title: "Location Tracker",
                    headerTintColor: isDarkMode ? "#fff" : "#000",
          headerShown: true,
          headerLeft: () => (
            <Ionicons onPress={()=> router.back()}  style={{ marginRight: 16 }} name="chevron-back" size={24} color="#ff5330" />
          )
        }}
      />

      <Stack.Screen
        name="history"
        options={{
          title: "History",
          headerTintColor: isDarkMode ? "#fff" : "#000",
          headerShown: true,
          headerLeft: () => (
            <Ionicons onPress={()=> router.back()}  style={{ marginRight: 16 }} name="chevron-back" size={24} color="#ff5330" />
          )
        }}
      />

      <Stack.Screen
        name="notifications"
        options={{ 
          title: "Notifications", 
          headerShown: true,
          headerTintColor: isDarkMode ? "#fff" : "#000",
          headerLeft: () => (
            <Ionicons onPress={()=> router.back()} style={{ marginRight: 16 }} name="chevron-back" size={24} color="#ff5330" />
          )
         }}
      />

      <Stack.Screen
        name="safety-tips"
        options={{ 
          title: "Safety Tips", 
          headerShown: true,
          headerTintColor: isDarkMode ? "#fff" : "#000",
          headerLeft: () => (
            <Ionicons onPress={()=> router.back()} style={{ marginRight: 16 }} name="chevron-back" size={24} color="#ff5330" />
          )
         }}
      />

    </Stack>
  );
};

export default MenuComponents;
