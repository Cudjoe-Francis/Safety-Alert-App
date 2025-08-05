import {
  Text,
  View,
  StyleSheet,
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import * as Location from "expo-location";
import { database } from "..//..//firebaseConfig";
import { ref, set } from "firebase/database";
import { useTheme } from "../../themeContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";

const LocationTracker = () => {
  const [location, setLocationState] = useState<Location.LocationObject | null>(
    null
  );

  const { theme, isDarkMode } = useTheme();

  const navigation = useNavigation();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode
          ? offsetY > 23
            ? "#121212"
            : "#000"
          : "#fff",
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
        },
      });
    }, [isDarkMode, navigation])
  );

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Enable location permission to continue."
        );
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, // every 3 seconds
          distanceInterval: 1, // every 1 meter moved
        },
        (loc) => {
          setLocationState(loc);
          const { latitude, longitude } = loc.coords;

          // Send location to Firebase under test user ID
          const locationRef = ref(database, "users/USER_123/location");
          set(locationRef, {
            latitude,
            longitude,
            timestamp: Date.now(),
          });
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? theme.card : theme.background },
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
        Real-Time Location Tracker
      </Text>
      {location ? (
        <>
          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
            Latitude: {location.coords.latitude}
          </Text>
          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
            Longitude: {location.coords.longitude}
          </Text>
        </>
      ) : (
        <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
          Getting location...
        </Text>
      )}
    </View>
  );
};

export default LocationTracker;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
