import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "..//../themeContext";
import UserDetailsModal from "../components/user-details";
import { useNotification } from "../context/NotificationContext"; // Adjust path if needed

type ServiceId = "hospital" | "police" | "fire" | "campus";

interface Service {
  name: string;
  id: ServiceId;
  icon: ReactNode;
}

const Home: React.FC = () => {
  // --- State Definitions with Types ---
  const [isProfileModalVisible, setIsProfileModalVisible] =
    useState<boolean>(false);
  const [showHelpPopup, setShowHelpPopup] = useState<boolean>(false);
  const [activeService, setActiveService] = useState<ServiceId | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [isSosActive, setIsSosActive] = useState<boolean>(false); ///////////////////////////////////////////////////////
  // State to store the user's current location
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  // State to store any error messages related to location
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);

  const { isDarkMode } = useTheme();
  const { addNotification } = useNotification();

  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Animated value for SOS pulse animation
  const sosPulse = useRef(new Animated.Value(1)).current;
  const sosAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const animatedBorderColor = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const interpolateBorderColor = animatedBorderColor.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      "rgb(255,0,0)",
      "rgb(0,255,0)",
      "rgb(0,0,255)",
      "rgb(255,255,0)",
      "rgb(255,0,0)",
      "rgb(255,255,255)",
    ],
  });

  useEffect(() => {
    if (isDarkMode) {
      // Start RGB animation when dark mode is on
      animationRef.current = Animated.loop(
        Animated.timing(animatedBorderColor, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      );
      animationRef.current.start();
    } else {
      // Reset animation when dark mode is off
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      animatedBorderColor.setValue(0); // Reset color to initial
    }
  }, [isDarkMode, animatedBorderColor]);

  // --- useEffect for Location Permission and Fetching ---
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationErrorMsg(
          "Permission to access location was denied. Cannot find nearby places."
        );
        console.error("Location permission denied.");
        return;
      }

      // Get the current position
      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log("User Location fetched:", location.coords);
      } catch (error) {
        setLocationErrorMsg(
          "Could not get current location. Please ensure GPS is enabled."
        );
        console.error("Error getting location:", error);
      }
    })();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleOpenProfileModal = (): void => {
    setShowHelpPopup(false); // Close help popup if open
    setIsProfileModalVisible(true);
  };

  // --- Functions for Service Button Logic with Types ---

  const handleServicePress = (serviceName: ServiceId): void => {
    if (!activeService) {
      setActiveService(serviceName);
      console.log(`${serviceName} service activated.`);
    }
  };

  const handleOpenCancelModal = (): void => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = (): void => {
    console.log(`${activeService} service cancelled.`);
    setActiveService(null);
    setShowCancelModal(false);
  };

  const handleCloseCancelModal = (): void => {
    setShowCancelModal(false);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleSosPress = (): void => {
    setIsSosActive(true);
    addNotification("SOS activated! Alerting your emergency contacts..."); // <-- Add this line

    // Start SOS pulse animation and store the animation instance
    sosAnimationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(sosPulse, {
          toValue: 1.2,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(sosPulse, {
          toValue: 1,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    sosAnimationRef.current.start(); // Start the animation

    // Simulate sending notification and stop animation after a delay
    setTimeout(() => {
      if (sosAnimationRef.current) {
        sosAnimationRef.current.stop(); // Stop the animation using the stored ref
      }
      sosPulse.setValue(1); // Reset scale
      setIsSosActive(false);
      console.log("Contacts notified successfully.");
    }, 3000);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Opens the device's default map application with a search query.
   * Prioritizes Google Maps if installed, otherwise falls back to default maps.
   * @param query The search term (e.g., "police station", "hospital").
   */
  const openMapsForQuery = async (query: string): Promise<void> => {
    const encodedQuery = encodeURIComponent(query);
    let url: string = "";

    if (Platform.OS === "ios") {
      // Try to open Google Maps first on iOS
      const googleMapsUrl = userLocation
        ? `comgooglemaps://?q=${encodedQuery}&center=${userLocation.latitude},${userLocation.longitude}`
        : `comgooglemaps://?q=${encodedQuery}`;

      const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsUrl);

      if (canOpenGoogleMaps) {
        url = googleMapsUrl;
      } else {
        // Fallback to Apple Maps if Google Maps is not installed
        url = userLocation
          ? `http://maps.apple.com/?ll=${userLocation.latitude},${userLocation.longitude}&q=${encodedQuery}`
          : `http://maps.apple.com/?q=${encodedQuery}`;
        console.log(
          "Google Maps not installed on iOS, falling back to Apple Maps."
        );
      }
    } else {
      // Android: Google Maps via geo URI (typically defaults to Google Maps)
      url = userLocation
        ? `geo:${userLocation.latitude},${userLocation.longitude}?q=${encodedQuery}`
        : `geo:0,0?q=${encodedQuery}`;
    }

    // Attempt to open the URL
    Linking.openURL(url).catch((err) => {
      console.error("An error occurred trying to open maps:", err);
      // You could add a user-facing message here, e.g., using a custom modal or toast
    });
  };

  // --- Service Button Data with Type ---
  const services: Service[] = [
    {
      name: "Hospital",
      id: "hospital",
      icon: <FontAwesome5 name="hospital-alt" size={40} color="#008000" />,
    },
    {
      name: "Police",
      id: "police",
      icon: <MaterialIcons name="security" size={40} color="#121a68" />,
    },
    {
      name: "Fire Service",
      id: "fire",
      icon: (
        <MaterialIcons name="local-fire-department" size={40} color="red" />
      ),
    },
    {
      name: "Campus Watch",
      id: "campus",
      icon: <MaterialIcons name="security" size={40} color="#5d3fd3" />,
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.mainContainer,
          { backgroundColor: isDarkMode ? "#000" : "#fff" },
        ]}
      >
        {/* Pressable to close the help popup when tapping outside */}
        <Pressable onPress={() => setShowHelpPopup(false)} style={{ flex: 1 }}>
          {/* Top Bar: Profile and Find Help */}
          <View style={styles.profile_location_help_ctn}>
            {/* Profile Section */}
            <View style={styles.profileContainer}>
              <FontAwesome5 name="user-circle" size={24} color="#ff5330" />
              <View>
                <Text
                  style={[
                    styles.profile_name,
                    { color: isDarkMode ? "#fff" : "#555" },
                  ]}
                >
                  Hello Deep
                </Text>
                <TouchableOpacity onPress={handleOpenProfileModal}>
                  <Text style={styles.see_profile}>See Profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Find Help Section */}
            <View style={styles.find_help_ctn}>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => setShowHelpPopup((prev) => !prev)} // Toggle help popup visibility
              >
                <View style={{ width: 70 }}>
                  <Text style={styles.find_help_text}>Find Help nearby</Text>
                </View>
                <Entypo name="location-pin" size={28} color="#ff5330" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Details Modal */}
          <Modal
            visible={isProfileModalVisible}
            onRequestClose={() => setIsProfileModalVisible(false)}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            {/* Using the actual UserDetailsModal component here */}
            <UserDetailsModal
              closeModal={() => setIsProfileModalVisible(false)}
            />
          </Modal>

          {/* Find Help Nearby Popup */}
          {showHelpPopup && (
            <View style={styles.popupAbsoluteContainer}>
              <View style={styles.popup}>
                {/* Police Station option - opens map with police station search */}
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setShowHelpPopup(false); // Close popup after selection
                    openMapsForQuery("police station"); // Open maps for police stations
                  }}
                >
                  <MaterialIcons name="security" size={24} color="#ff4330" />
                  <Text style={styles.popupText}>Police Station</Text>
                </TouchableOpacity>
                {/* Hospitals option - opens map with hospital search */}
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setShowHelpPopup(false); // Close popup after selection
                    openMapsForQuery("hospital"); // Open maps for hospitals
                  }}
                >
                  <FontAwesome5 name="hospital-alt" size={20} color="#ff5330" />
                  <Text style={styles.popupText}>Hospitals</Text>
                </TouchableOpacity>
                {/* Display location error if any */}
                {locationErrorMsg && (
                  <Text style={styles.locationErrorText}>
                    {locationErrorMsg}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Emergency Assistance Section */}
          <Text
            style={[
              styles.emergency_help_text,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            Emergency Assistance
          </Text>

          {/* Middle Buttons View for emergency services */}
          <View style={styles.middleContainer}>
            {services.map((service) => {
              const isThisServiceActive = activeService === service.id;
              const isAnyServiceActive = activeService !== null;
              const isDisabled = isAnyServiceActive && !isThisServiceActive;

              return (
                <Animated.View
                  key={service.id}
                  style={[
                    styles.assistanceBtn,
                    isDarkMode
                      ? {
                          ...styles.assistanceBtnDarkMode,
                          borderColor: interpolateBorderColor,
                        }
                      : styles.assistanceBtnLightMode,
                    isDisabled && styles.disabledBtn,
                  ]}
                >
                  <TouchableOpacity
                    key={service.id}
                    style={[
                      [
                        styles.assistanceBtn,
                        isDarkMode
                          ? styles.assistanceBtnDarkMode
                          : styles.assistanceBtnLightMode,
                      ],
                      isDisabled && styles.disabledBtn,
                    ]}
                    onPress={() => handleServicePress(service.id)}
                    disabled={isAnyServiceActive}
                  >
                    {service.icon}
                    <Text
                      style={[
                        styles.assistanceBtnText,
                        { color: isDarkMode ? "#fff" : "#000" },
                      ]}
                    >
                      {service.name}
                    </Text>

                    {/* Cancel button appears if this service is active */}
                    {isThisServiceActive && (
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={handleOpenCancelModal}
                      >
                        <MaterialIcons name="cancel" size={28} color="#fff" />
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          <View style={styles.bottomContainer}>
            {/* Alert Text and SOS Button */}
            <Text
              style={[
                styles.alertText,
                { color: isDarkMode ? "#bfc1c4" : "grey" },
              ]}
            >
              Alert your contacts, You are in danger
            </Text>

            {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            <TouchableOpacity
              style={styles.sosContainer}
              onPress={handleSosPress}
              activeOpacity={0.8}
            >
              <Animated.View style={[{ transform: [{ scale: sosPulse }] }]}>
                <MaterialIcons name="sos" size={36} color="#fff" />
              </Animated.View>
            </TouchableOpacity>

            {isSosActive && (
              <Text style={styles.notifyingText}>
                Alerting your contacts...
              </Text>
            )}
            {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          </View>
        </Pressable>

        {/* --- Cancellation Confirmation Modal --- */}
        <Modal
          visible={showCancelModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseCancelModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Cancellation</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to cancel the `{activeService}`` request?
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={handleCloseCancelModal}
                >
                  <Text style={styles.modalButtonText}>Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={handleConfirmCancel}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  profile_location_help_ctn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    // backgroundColor: 'red',
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },

  profile_name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  see_profile: {
    color: "#ff5330",
    fontSize: 15,
    fontWeight: "500",
  },

  find_help_ctn: {
    flexDirection: "row",
    alignItems: "center",
  },

  find_help_text: {
    color: "#ff5330",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },

  popupAbsoluteContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 10,
  },

  popup: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },

  option: {
    paddingVertical: 10,
    flexDirection: "row",
    columnGap: 12,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  popupText: {
    fontSize: 17,
    color: "#333",
  },

  locationErrorText: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
    paddingHorizontal: 10,
    textAlign: "center",
  },

  emergency_help_text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 35,
    paddingBottom: 25,
  },

  middleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 30,
    columnGap: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    // backgroundColor: "pink", /////////////////////////////////////////////////////////////
  },

  bottomContainer: {
    // backgroundColor: 'blue',
    flex: 1,
    justifyContent: "center",
  },

  assistanceBtn: {
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 140,
    rowGap: 12,
    position: "relative",
  },

  assistanceBtnLightMode: {
    backgroundColor: "#f5f5f5",
    overflow: "hidden",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  assistanceBtnDarkMode: {
    backgroundColor: "#000",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderColor: "#fff",
        borderWidth: 1,
      },

      android: {
        elevation: 10,
        borderColor: "#fff",
        borderWidth: 1,
      },
    }),
  },

  assistanceBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },

  alertText: {
    textAlign: "center",
    fontSize: 16,
    color: "grey",
  },

  sosContainer: {
    backgroundColor: "#ff5330",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    alignSelf: "center",
    borderRadius: 40,
    marginTop: 15,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
  },

  disabledBtn: {
    opacity: 0.4,
    backgroundColor: "#e0e0e0",
  },

  cancelBtn: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    zIndex: 5,
  },

  cancelBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    color: "#555",
    lineHeight: 22,
  },

  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },

  modalButtonCancel: {
    backgroundColor: "#6c757d",
  },

  modalButtonConfirm: {
    backgroundColor: "#ff5330",
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  notifyingText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#ff5330",
    fontWeight: "bold",
  },
});
