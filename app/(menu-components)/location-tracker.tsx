import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useTheme } from "../../themeContext";
import { getCurrentLocation } from "../../utils/getLocation";
import { reverseGeocode } from "../../utils/reverseGeocode";

const LocationTracker = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    async function fetchLocation() {
      setLoading(true);
      try {
        const loc = await getCurrentLocation();
        setLocation(loc);
        const addr = await reverseGeocode(loc.lat, loc.lng);
        setAddress(addr);
      } catch (err) {
        setAddress("Unable to get location");
      }
      setLoading(false);
    }
    fetchLocation();
  }, []);

  const handleShare = async () => {
    if (!location) return;
    const msg = `My current location: ${address}\nhttps://maps.google.com/?q=${location.lat},${location.lng}`;
    const urlWhatsApp = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    const urlSMS = `sms:?body=${encodeURIComponent(msg)}`;
    const urlEmail = `mailto:?subject=My Location&body=${encodeURIComponent(
      msg
    )}`;

    // Show options
    Linking.openURL(urlWhatsApp).catch(() => {
      Linking.openURL(urlSMS).catch(() => {
        Linking.openURL(urlEmail);
      });
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? theme.card : theme.background },
      ]}
    >
      <Text style={styles.title}>Your Current Location</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#121a68"
          style={{ marginTop: 40 }}
        />
      ) : (
        <>
          <Text style={styles.address}>{address}</Text>
          {location && (
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              showsUserLocation
              showsMyLocationButton
              zoomEnabled
              scrollEnabled
              pitchEnabled
              rotateEnabled
              mapType="standard"
            >
              <Marker
                coordinate={{ latitude: location.lat, longitude: location.lng }}
                title="You are here"
                description={address}
              />
            </MapView>
          )}
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Ionicons name="share-social" size={22} color="#fff" />
            <Text style={styles.shareText}>Share Location</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LocationTracker;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, borderRadius: 10, margin: 10 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  address: { fontSize: 15, color: "#444", marginBottom: 12 },
  map: { width: "100%", height: 320, borderRadius: 14, marginBottom: 18 },
  shareBtn: {
    flexDirection: "row",
    backgroundColor: "#121a68",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    elevation: 2,
  },
  shareText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
