import Entypo from "@expo/vector-icons/Entypo";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveUserDetails } from "../../utils/saveUserDetails";
import { useTheme } from "..//..//themeContext";

interface UserDetailsModalProps {
  closeModal: () => void;
}

// Placeholder for a local image asset (replace with your actual path if needed)
const defaultProfilePictureUri =
  // require("../../assets/images/default-profile-picture.png");
  "https://placehold.co/60x60/ff5330/ffffff?text=PP";

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ closeModal }) => {
  const { isDarkMode, theme } = useTheme();

  // State to manage edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // State to store user details (default to "None" for missing fields)
  const [userDetails, setUserDetails] = useState({
    firstName: "None",
    lastName: "None",
    occupation: "None",
    phone: "None",
    email: "None",
    address: "None",
    gender: "None",
    dob: "None",
    bloodType: "None",
    medicalCondition: "None",
    allergies: "None",
    profileImageUrl: defaultProfilePictureUri, // <-- Add this line
  });

  // State for the profile picture source (using URI for network or base64)
  const [profileImageSrc, setProfileImageSrc] = useState<string>(
    defaultProfilePictureUri
  );

  // Temporary state to hold changes during edit mode before saving
  const [tempDetails, setTempDetails] = useState(userDetails);
  const [tempProfileImageSrc, setTempProfileImageSrc] =
    useState(profileImageSrc);

  // New states for dropdown open/close
  const [genderOpen, setGenderOpen] = useState(false);
  const [bloodOpen, setBloodOpen] = useState(false);

  // For DropDownPicker, values must be in arrays
  const genderItems = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];
  const bloodItems = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ];

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        // ImagePicker is primarily for native platforms
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "We need camera roll permissions to make this work! Please enable it in your device settings.",
            [{ text: "OK" }]
          );
        }
      }
    })();
  }, []);

  // Fetch user details from Firebase on mount
  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const user = auth.currentUser;
    if (user) {
      // Get email from Auth
      const email = user.email || "None";
      // Get other details from Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val() || {};
        setUserDetails({
          firstName: data.firstName || "None",
          lastName: data.lastName || "None",
          occupation: data.occupation || "None",
          phone: data.phone || "None",
          email: email,
          address: data.address || "None",
          gender: data.gender || "None",
          dob: data.dob || "None",
          bloodType: data.bloodType || "None",
          medicalCondition: data.medicalCondition || "None",
          allergies: data.allergies || "None",
          profileImageUrl: data.profileImageUrl || defaultProfilePictureUri, // <-- Add this line
        });
      });
    }
  }, []);

  // Function to handle toggling between view and edit mode
  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      try {
        const profileUrl = await saveUserDetails(
          tempDetails,
          tempProfileImageSrc
        );
        setUserDetails({ ...tempDetails, profileImageUrl: profileUrl });
        setProfileImageSrc(profileUrl || tempProfileImageSrc);
        Alert.alert("Saved", "Your details have been updated.");

        // Update Firestore document
        const firestore = getFirestore();
        await setDoc(doc(firestore, "users", auth.currentUser.uid), {
          ...tempDetails,
          profileImageUrl: profileUrl,
          email: userDetails.email,
        });
      } catch (error) {
        console.error("Save user details error:", error);
        Alert.alert("Error", "Failed to save details. Please try again.");
      }
    } else {
      setTempDetails(userDetails);
      setTempProfileImageSrc(profileImageSrc);
    }
    setIsEditing(!isEditing);
  };

  // Function to handle changes in editable input fields
  const handleFieldChange = (
    field: keyof typeof userDetails,
    value: string
  ) => {
    setTempDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Function to handle profile picture selection using expo-image-picker
  const handleProfilePictureClick = async () => {
    if (isEditing) {
      setIsPickingImage(true); // Set loading state
      try {
        // Permissions are requested on mount, but we can re-check here if needed
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Sorry, we need camera roll permissions to make this work! Please enable it in your device settings.",
            [{ text: "OK" }]
          );
          return;
        }

        // Launch image library to pick an image
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        console.log("ImagePicker Result:", result); // Log the result for debugging

        if (!result.canceled && result.assets && result.assets.length > 0) {
          // Update the temporary profile image source with the selected image URI
          setTempProfileImageSrc(result.assets[0].uri);
        } else if (result.canceled) {
          console.log("Image picking cancelled.");
        } else {
          console.log("No assets found in the result.");
        }
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Failed to pick image. Please try again.");
      } finally {
        setIsPickingImage(false); // Reset loading state
      }
    }
  };

  const iconMap = {
    phone: <MaterialIcons name="phone" size={20} color="#ff5330" />,
    email: <MaterialIcons name="email" size={20} color="#ff5330" />,
    address: <Entypo name="address" size={20} color="#ff5330" />,
    gender: <Ionicons name="male-female" size={20} color="#ff5330" />,
    dob: <MaterialIcons name="cake" size={20} color="#ff5330" />,
    bloodType: <FontAwesome5 name="tint" size={18} color="#ff5330" />,
    medicalCondition: (
      <MaterialIcons name="healing" size={20} color="#ff5330" />
    ),
    allergies: <MaterialIcons name="warning" size={20} color="#ff5330" />,
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      {/* Top Container with Close and Edit/Done Buttons */}
      <View
        style={[
          styles.topContainer,
          {
            backgroundColor: theme.card,
            borderBottomColor: isDarkMode ? "#222" : "#eee",
          },
        ]}
      >
        <Pressable onPress={closeModal}>
          <Entypo name="chevron-down" size={30} color="#ff5330" />
        </Pressable>
        <Pressable onPress={handleEditToggle}>
          {isEditing ? (
            // <Entypo name="check" size={24} color="#ff5330" />
            <Text style={{ color: "#ff5330", fontWeight: "800", fontSize: 16 }}>
              Done
            </Text>
          ) : (
            // <Entypo name="edit" size={20} color="#ff5330" />
            <Text style={{ color: "#ff5330", fontWeight: "800", fontSize: 16 }}>
              Edit
            </Text>
          )}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        {/* Profile Details Container */}
        <ScrollView
          style={[styles.profileContainer, { backgroundColor: theme.card }]}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Image and Name/Occupation */}
          <View style={styles.profileImageContainer}>
            <Pressable
              onPress={handleProfilePictureClick}
              style={styles.profileImagePressable}
            >
              <Image
                source={{
                  uri: isEditing ? tempProfileImageSrc : profileImageSrc,
                }}
                style={styles.profileImage}
              />
              {isEditing && (
                <View style={styles.changeOverlay}>
                  {isPickingImage ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.changeText}>Change</Text>
                  )}
                </View>
              )}
            </Pressable>
            <View style={styles.name_occupation_ctn}>
              <Text
                style={[
                  styles.nameText,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {userDetails.firstName} {userDetails.lastName}
              </Text>
              <Text
                style={[
                  styles.occupationText,
                  { color: isDarkMode ? "#bbb" : "grey" },
                ]}
              >
                {userDetails.occupation}
              </Text>
            </View>
          </View>

          <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
            {/* Phone Number */}
            <View style={styles.detailRow}>
              {iconMap.phone}
              <View style={styles.detailTextCtn}>
                <Text
                  style={[
                    styles.detailsQue,
                    { color: isDarkMode ? "#bbb" : "grey" },
                  ]}
                >
                  Phone No
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.detailsInput,
                      {
                        backgroundColor: isDarkMode ? "#222" : "#fefefe",
                        color: isDarkMode ? "#fff" : "#333",
                        borderColor: isDarkMode ? "#333" : "#ddd",
                      },
                    ]}
                    placeholder="Phone Number"
                    placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                    value={tempDetails.phone}
                    onChangeText={(text) => handleFieldChange("phone", text)}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                  />
                ) : (
                  <Text
                    style={[
                      styles.detailsAns,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {userDetails.phone}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.divider} />

            {/* Email */}
            <View style={styles.detailRow}>
              {iconMap.email}
              <View style={styles.detailTextCtn}>
                <Text
                  style={[
                    styles.detailsQue,
                    { color: isDarkMode ? "#bbb" : "grey" },
                  ]}
                >
                  Email
                </Text>
                <Text
                  style={[
                    styles.detailsAns,
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  {userDetails.email}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />

            {/* Home Address */}
            <View style={styles.detailRow}>
              {iconMap.address}
              <View style={styles.detailTextCtn}>
                <Text
                  style={[
                    styles.detailsQue,
                    { color: isDarkMode ? "#bbb" : "grey" },
                  ]}
                >
                  Home Address
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.detailsInput,
                      {
                        backgroundColor: isDarkMode ? "#222" : "#fefefe",
                        color: isDarkMode ? "#fff" : "#333",
                        borderColor: isDarkMode ? "#333" : "#ddd",
                      },
                    ]}
                    placeholder="Home Address"
                    placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                    value={tempDetails.address}
                    onChangeText={(text) => handleFieldChange("address", text)}
                    returnKeyType="done"
                  />
                ) : (
                  <Text
                    style={[
                      styles.detailsAns,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {userDetails.address}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.divider} />

            {/* Occupation */}
            <View style={styles.detailRow}>
              <MaterialIcons name="work" size={20} color="#ff5330" />
              <View style={styles.detailTextCtn}>
                <Text
                  style={[
                    styles.detailsQue,
                    { color: isDarkMode ? "#bbb" : "grey" },
                  ]}
                >
                  Occupation
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.detailsInput,
                      {
                        backgroundColor: isDarkMode ? "#222" : "#fefefe",
                        color: isDarkMode ? "#fff" : "#333",
                        borderColor: isDarkMode ? "#333" : "#ddd",
                      },
                    ]}
                    placeholder="Occupation"
                    placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                    value={tempDetails.occupation}
                    onChangeText={(text) =>
                      handleFieldChange("occupation", text)
                    }
                    returnKeyType="done"
                  />
                ) : (
                  <Text
                    style={[
                      styles.detailsAns,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {userDetails.occupation}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.divider} />

            {/* Gender */}
            <View style={styles.detailRow}>
              {iconMap.gender}
              <View style={styles.detailTextCtn}>
                <Text
                  style={[
                    styles.detailsQue,
                    { color: isDarkMode ? "#bbb" : "grey" },
                  ]}
                >
                  Gender
                </Text>
                {isEditing ? (
                  <DropDownPicker
                    open={genderOpen}
                    setOpen={setGenderOpen}
                    value={
                      tempDetails.gender === "None" ? null : tempDetails.gender
                    }
                    setValue={(callback) => {
                      const value = callback(
                        tempDetails.gender === "None"
                          ? null
                          : tempDetails.gender
                      );
                      handleFieldChange("gender", value || "None");
                    }}
                    items={genderItems}
                    placeholder="Select Gender"
                    style={{
                      backgroundColor: isDarkMode ? "#222" : "#f9f9f9",
                      borderColor: isDarkMode ? "#333" : "#ddd",
                      minHeight: 44,
                    }}
                    textStyle={{
                      color: isDarkMode ? "#fff" : "#222",
                    }}
                    dropDownContainerStyle={{
                      backgroundColor: isDarkMode ? "#222" : "#fff",
                      borderColor: isDarkMode ? "#333" : "#ddd",
                    }}
                    zIndex={3000}
                    zIndexInverse={1000}
                    listMode="SCROLLVIEW"
                  />
                ) : (
                  <Text
                    style={[
                      styles.detailsAns,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {userDetails.gender}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.divider} />

            {/* Date of Birth */}
            <View style={styles.detailRow}>
              {iconMap.dob}
              <View style={styles.detailTextCtn}>
                <Text
                  style={[
                    styles.detailsQue,
                    { color: isDarkMode ? "#bbb" : "grey" },
                  ]}
                >
                  Date of Birth
                </Text>
                {isEditing ? (
                  <>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={[
                        styles.detailsInput,
                        {
                          backgroundColor: isDarkMode ? "#222" : "#f9f9f9", // off-white for light mode
                          borderColor: isDarkMode ? "#333" : "#ddd",
                          justifyContent: "center",
                        },
                      ]}
                    >
                      <Text style={{ color: isDarkMode ? "#fff" : "#222" }}>
                        {tempDetails.dob === "None"
                          ? "Select Date"
                          : tempDetails.dob}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={
                          tempDetails.dob !== "None"
                            ? new Date(tempDetails.dob)
                            : new Date(2000, 0, 1)
                        }
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(_, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            // Format as YYYY-MM-DD
                            const formatted = selectedDate
                              .toISOString()
                              .split("T")[0];
                            handleFieldChange("dob", formatted);
                          }
                        }}
                        themeVariant={isDarkMode ? "dark" : "light"}
                      />
                    )}
                  </>
                ) : (
                  <Text
                    style={[
                      styles.detailsAns,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {userDetails.dob}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.divider} />

            {/* Blood Type */}
            <View style={styles.detailRow}>
              {iconMap.bloodType}
              <View style={styles.detailTextCtn}>
                <Text
                  style={[
                    styles.detailsQue,
                    { color: isDarkMode ? "#bbb" : "grey" },
                  ]}
                >
                  Blood Type
                </Text>
                {isEditing ? (
                  <DropDownPicker
                    open={bloodOpen}
                    setOpen={setBloodOpen}
                    value={
                      tempDetails.bloodType === "None"
                        ? null
                        : tempDetails.bloodType
                    }
                    setValue={(callback) => {
                      const value = callback(
                        tempDetails.bloodType === "None"
                          ? null
                          : tempDetails.bloodType
                      );
                      handleFieldChange("bloodType", value || "None");
                    }}
                    items={bloodItems}
                    placeholder="Select Blood Type"
                    style={{
                      backgroundColor: isDarkMode ? "#222" : "#f9f9f9",
                      borderColor: isDarkMode ? "#333" : "#ddd",
                      minHeight: 44,
                    }}
                    textStyle={{
                      color: isDarkMode ? "#fff" : "#222",
                    }}
                    dropDownContainerStyle={{
                      backgroundColor: isDarkMode ? "#222" : "#fff",
                      borderColor: isDarkMode ? "#333" : "#ddd",
                    }}
                    zIndex={2000}
                    zIndexInverse={2000}
                    listMode="SCROLLVIEW"
                  />
                ) : (
                  <Text
                    style={[
                      styles.detailsAns,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {userDetails.bloodType}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.divider} />

            {/* Medical Condition */}
            <View style={styles.detailRow}>
              {iconMap.medicalCondition}
              <View style={styles.detailTextCtn}>
                <Text
                  style={[
                    styles.detailsQue,
                    { color: isDarkMode ? "#bbb" : "grey" },
                  ]}
                >
                  Medical Condition
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.detailsInput,
                      {
                        backgroundColor: isDarkMode ? "#222" : "#fefefe",
                        color: isDarkMode ? "#fff" : "#333",
                        borderColor: isDarkMode ? "#333" : "#ddd",
                      },
                    ]}
                    placeholder="Medical Condition"
                    placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                    value={tempDetails.medicalCondition}
                    onChangeText={(text) =>
                      handleFieldChange("medicalCondition", text)
                    }
                    returnKeyType="done"
                  />
                ) : (
                  <Text
                    style={[
                      styles.detailsAns,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {userDetails.medicalCondition}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.divider} />

            {/* Allergies */}
            <View style={styles.detailRow}>
              {iconMap.allergies}
              <View style={styles.detailTextCtn}>
                <Text
                  style={[
                    styles.detailsQue,
                    { color: isDarkMode ? "#bbb" : "grey" },
                  ]}
                >
                  Allergies
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.detailsInput,
                      {
                        backgroundColor: isDarkMode ? "#222" : "#f9f9f9", // <-- Slightly off-white for light mode
                        color: isDarkMode ? "#fff" : "#222",
                        borderColor: isDarkMode ? "#333" : "#ddd",
                      },
                    ]}
                    placeholder="Allergies"
                    placeholderTextColor={isDarkMode ? "#888" : "#888"}
                    value={tempDetails.allergies}
                    onChangeText={(text) =>
                      handleFieldChange("allergies", text)
                    }
                    returnKeyType="done"
                  />
                ) : (
                  <Text
                    style={[
                      styles.detailsAns,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {userDetails.allergies}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusBar style={isDarkMode ? "dark" : "light"} />
    </SafeAreaView>
  );
};

export default UserDetailsModal;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileImageContainer: {
    flexDirection: "row",
    columnGap: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  profileImagePressable: {
    position: "relative",
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  changeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  changeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  name_occupation_ctn: {
    flexDirection: "column",
    rowGap: 5,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  occupationText: {
    fontSize: 16,
    color: "grey",
  },
  detailsCard: {
    borderRadius: 14,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  detailsList: {
    paddingBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  detailTextCtn: {
    flex: 1,
  },
  detailsQue: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailsAns: {
    fontSize: 20,
  },
  detailsInput: {
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 6,
    marginLeft: 32,
  },
});
