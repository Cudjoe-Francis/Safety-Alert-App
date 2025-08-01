import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import { database } from "..//..//firebaseConfig";
import { ref, set } from "firebase/database";

const LocationTracker = () => {
  const [location, setLocationState] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Enable location permission to continue.");
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
    <View style={styles.container}>
      <Text style={styles.title}>Real-Time Location Tracker</Text>
      {location ? (
        <>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </>
      ) : (
        <Text>Getting location...</Text>
      )}
    </View>
  );
};

export default LocationTracker;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
